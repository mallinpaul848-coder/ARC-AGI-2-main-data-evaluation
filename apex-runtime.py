#!/usr/bin/env python3
"""Minimal, deterministic APEXMODEL1 reference runtime.

This is a reference implementation for artifact inspection/reproduction.
The production HTTP service remains server.js.
"""
import hashlib
import json
import sys

MAGIC = "APEXMODEL1"


class ApexModel:
    def __init__(self, path):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        self._validate(data)
        self.d = data
        with open(path, "rb") as f:
            self.sha256 = hashlib.sha256(f.read()).hexdigest()

    @staticmethod
    def _validate(d):
        if d.get("format") != MAGIC:
            raise ValueError("invalid APEX model format")
        vocab = d.get("vocab")
        rows = d.get("weights")
        tokens = d.get("id_to_token")
        context = d.get("context")
        if not isinstance(vocab, dict) or not isinstance(rows, list) or not isinstance(tokens, list):
            raise ValueError("invalid APEX model schema")
        if not isinstance(context, int) or context < 1:
            raise ValueError("invalid APEX context")
        if len(rows) != len(tokens):
            raise ValueError("invalid APEX dimensions")
        width = len(tokens)
        for row in rows:
            if not isinstance(row, list) or len(row) != width:
                raise ValueError("invalid APEX weight row")
            if not all(isinstance(x, (int, float)) and x == x for x in row):
                raise ValueError("invalid APEX weight value")

    def generate(self, prompt, max_tokens=128):
        limit = max(1, min(int(max_tokens), 256))
        v = self.d["vocab"]
        rows = self.d["weights"]
        ids = [v[c] for c in str(prompt) if c in v][-self.d["context"]:]
        out = []
        for _ in range(limit):
            prev = ids[-1] if ids else 0
            row = rows[prev]
            nxt = max(range(len(row)), key=lambda i: (row[i], -i))
            ch = self.d["id_to_token"][nxt]
            if not isinstance(ch, str):
                raise ValueError("invalid APEX token")
            if ch == "\n":
                break
            out.append(ch)
            ids = (ids + [nxt])[-self.d["context"]:]
        return "".join(out)


def main():
    if len(sys.argv) < 2:
        print("usage: apex-runtime.py MODEL [PROMPT]", file=sys.stderr)
        return 2
    prompt = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else sys.stdin.read()
    model = ApexModel(sys.argv[1])
    print(json.dumps({
        "model_sha256": model.sha256,
        "output": model.generate(prompt),
        "deterministic": True,
        "source": "APEX_MODEL_ONLY",
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
