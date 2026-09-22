#!/usr/bin/env python3
"""Persistent local inference worker for APEX-TRANSFORMER-1 checkpoints.

Protocol: newline-delimited JSON on stdin/stdout.
No hosted model API or network access is used.
"""
from __future__ import annotations
import json, sys
from pathlib import Path
import torch

from training.apex_transformer import APEXTransformer, ModelConfig

def load(path: str):
    ckpt = torch.load(path, map_location="cpu", weights_only=False)
    if ckpt.get("format") != "APEX-TRANSFORMER-1":
        raise RuntimeError("INVALID_APEX_TRANSFORMER_CHECKPOINT")
    cfg = ModelConfig(**ckpt["model_config"])
    model = APEXTransformer(cfg)
    model.load_state_dict(ckpt["model"], strict=True)
    model.eval()
    return model, cfg, ckpt

def generate(model, cfg, prompt: str, max_tokens: int):
    # Byte tokenization is intentionally limited to the current checkpoint
    # contract. A production release must ship a versioned tokenizer artifact.
    data = list(prompt.encode("utf-8"))
    if not data:
        data = [32]
    if any(x >= cfg.vocab_size for x in data):
        raise RuntimeError("PROMPT_BYTE_OUTSIDE_VOCAB")
    ids = torch.tensor([data[-cfg.max_seq_len:]], dtype=torch.long)
    out = []
    with torch.inference_mode():
        for _ in range(max(1, min(int(max_tokens), 256))):
            logits, _ = model(ids)
            nxt = int(torch.argmax(logits[0, -1], dim=-1))
            out.append(nxt)
            ids = torch.cat([ids, torch.tensor([[nxt]])], dim=1)
            if ids.shape[1] > cfg.max_seq_len:
                ids = ids[:, -cfg.max_seq_len:]
    return bytes([x for x in out if 0 <= x < 256]).decode("utf-8", errors="replace")

def main():
    path = sys.argv[1]
    model, cfg, ckpt = load(path)
    for line in sys.stdin:
        try:
            req = json.loads(line)
            if req.get("op") == "health":
                result = {"ok": True, "format": ckpt["format"], "step": ckpt["step"],
                          "parameters": sum(p.numel() for p in model.parameters()),
                          "model_config": ckpt["model_config"]}
            elif req.get("op") == "generate":
                result = {"ok": True, "text": generate(model, cfg, str(req.get("prompt","")), int(req.get("max_tokens",64)))}
            else:
                raise RuntimeError("UNKNOWN_OPERATION")
            print(json.dumps(result, ensure_ascii=False), flush=True)
        except Exception as e:
            print(json.dumps({"ok": False, "error": str(e)}), flush=True)

if __name__ == "__main__":
    main()
