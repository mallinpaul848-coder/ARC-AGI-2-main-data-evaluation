#!/usr/bin/env python3
"""Deterministic, dependency-free APEXMODEL1 trainer.

This is a capability-development scaffold, not a claim of frontier performance.
It learns a character next-token transition matrix from a local text corpus and
exports a self-contained APEXMODEL1 artifact that server.js can load.
"""

import argparse
import hashlib
import json
import random
from pathlib import Path

FORMAT = "APEXMODEL1"


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def build_vocab(text):
    tokens = sorted(set(text))
    if not tokens:
        raise ValueError("training corpus is empty")
    return tokens


def train(corpus, epochs=3, seed=0):
    vocab = build_vocab(corpus)
    index = {t: i for i, t in enumerate(vocab)}
    n = len(vocab)
    counts = [[0 for _ in range(n)] for _ in range(n)]

    # Deterministic shuffled passes make the training procedure explicit while
    # preserving identical output for identical corpus/configuration/seed.
    rng = random.Random(seed)
    pairs = [(corpus[i], corpus[i + 1]) for i in range(len(corpus) - 1)]
    for _ in range(epochs):
        order = list(range(len(pairs)))
        rng.shuffle(order)
        for j in order:
            a, b = pairs[j]
            counts[index[a]][index[b]] += 1

    # Runtime selects the maximum-weight next token. Preserve deterministic
    # tie-breaking by vocabulary order.
    weights = []
    for row in counts:
        weights.append(row)

    return vocab, weights


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="local UTF-8 training corpus")
    ap.add_argument("--output", required=True, help="APEXMODEL1 JSON output")
    ap.add_argument("--epochs", type=int, default=3)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--context", type=int, default=256)
    args = ap.parse_args()

    if args.epochs < 1:
        raise SystemExit("--epochs must be >= 1")
    if args.context < 1:
        raise SystemExit("--context must be >= 1")

    source = Path(args.input).read_bytes()
    corpus = source.decode("utf-8")
    vocab, weights = train(corpus, args.epochs, args.seed)

    artifact = {
        "format": FORMAT,
        "version": "trained-transition-1.0.0",
        "context": args.context,
        "vocab": {token: i for i, token in enumerate(vocab)},
        "id_to_token": vocab,
        "weights": weights,
        "training": {
            "algorithm": "deterministic-character-next-token-counts",
            "epochs": args.epochs,
            "seed": args.seed,
            "corpus_sha256": sha256_bytes(source),
            "corpus_bytes": len(source),
            "parameter_count": len(vocab) * len(vocab),
        },
    }

    encoded = (json.dumps(artifact, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
    Path(args.output).write_bytes(encoded)
    print(json.dumps({
        "format": FORMAT,
        "output": str(args.output),
        "model_sha256": sha256_bytes(encoded),
        "vocab_size": len(vocab),
        "parameter_count": len(vocab) * len(vocab),
        "epochs": args.epochs,
        "seed": args.seed,
        "corpus_sha256": sha256_bytes(source),
    }, sort_keys=True))


if __name__ == "__main__":
    main()
