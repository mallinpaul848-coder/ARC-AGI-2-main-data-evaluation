#!/usr/bin/env python3
"""APEX scalable decoder-only Transformer training entry point.

This replaces the character-transition prototype with a real Transformer
training path. It is intentionally dependency-light: PyTorch is the only
runtime dependency. The model is APEX-owned; no hosted model API is used.

The script supports single-process CPU/GPU smoke tests and torchrun-based
distributed training. It does not claim that a large checkpoint exists until
training has actually been executed and its artifacts are published.
"""
from __future__ import annotations
import argparse, json, math, os, random, time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

import torch
import torch.distributed as dist
import torch.nn as nn
import torch.nn.functional as F


@dataclass
class ModelConfig:
    vocab_size: int = 32768
    hidden_size: int = 768
    num_layers: int = 12
    num_heads: int = 12
    num_kv_heads: int = 12
    intermediate_size: int = 3072
    max_seq_len: int = 2048
    rope_theta: float = 10000.0
    dropout: float = 0.0


@dataclass
class TrainConfig:
    batch_size: int = 2
    grad_accumulation: int = 8
    learning_rate: float = 3e-4
    min_learning_rate: float = 3e-5
    weight_decay: float = 0.1
    warmup_steps: int = 100
    max_steps: int = 1000
    eval_interval: int = 100
    save_interval: int = 500
    seed: int = 1337
    grad_clip: float = 1.0
    dtype: str = "bfloat16"


def init_distributed():
    if "RANK" not in os.environ:
        return False, 0, 1
    dist.init_process_group(backend="nccl" if torch.cuda.is_available() else "gloo")
    rank = dist.get_rank()
    world = dist.get_world_size()
    if torch.cuda.is_available():
        torch.cuda.set_device(int(os.environ["LOCAL_RANK"]))
    return True, rank, world


def cleanup_distributed():
    if dist.is_initialized():
        dist.destroy_process_group()


def seed_everything(seed: int, rank: int):
    s = seed + rank
    random.seed(s)
    torch.manual_seed(s)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(s)


def rotate_half(x):
    x1, x2 = x[..., : x.shape[-1] // 2], x[..., x.shape[-1] // 2 :]
    return torch.cat((-x2, x1), dim=-1)


def rope(x, positions, theta):
    dim = x.shape[-1]
    inv = 1.0 / (theta ** (torch.arange(0, dim, 2, device=x.device).float() / dim))
    freqs = torch.einsum("i,j->ij", positions.float(), inv)
    emb = torch.cat((freqs, freqs), dim=-1)
    cos, sin = emb.cos()[None, None, :, :], emb.sin()[None, None, :, :]
    return x * cos + rotate_half(x) * sin


class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(dim))
        self.eps = eps

    def forward(self, x):
        return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps) * self.weight


class SwiGLU(nn.Module):
    def __init__(self, dim, hidden):
        super().__init__()
        self.gate = nn.Linear(dim, hidden, bias=False)
        self.up = nn.Linear(dim, hidden, bias=False)
        self.down = nn.Linear(hidden, dim, bias=False)

    def forward(self, x):
        return self.down(F.silu(self.gate(x)) * self.up(x))


class GQAAttention(nn.Module):
    def __init__(self, cfg: ModelConfig):
        super().__init__()
        if cfg.num_heads % cfg.num_kv_heads:
            raise ValueError("num_heads must be divisible by num_kv_heads")
        self.h = cfg.num_heads
        self.kv = cfg.num_kv_heads
        self.d = cfg.hidden_size // cfg.num_heads
        self.q = nn.Linear(cfg.hidden_size, cfg.num_heads * self.d, bias=False)
        self.k = nn.Linear(cfg.hidden_size, cfg.num_kv_heads * self.d, bias=False)
        self.v = nn.Linear(cfg.hidden_size, cfg.num_kv_heads * self.d, bias=False)
        self.o = nn.Linear(cfg.hidden_size, cfg.hidden_size, bias=False)

    def forward(self, x):
        b, t, _ = x.shape
        q = self.q(x).view(b, t, self.h, self.d).transpose(1, 2)
        k = self.k(x).view(b, t, self.kv, self.d).transpose(1, 2)
        v = self.v(x).view(b, t, self.kv, self.d).transpose(1, 2)
        pos = torch.arange(t, device=x.device)
        q, k = rope(q, pos, 10000.0), rope(k, pos, 10000.0)
        if self.kv != self.h:
            repeat = self.h // self.kv
            k, v = k.repeat_interleave(repeat, 1), v.repeat_interleave(repeat, 1)
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        return self.o(y.transpose(1, 2).contiguous().view(b, t, -1))


class Block(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.n1 = RMSNorm(cfg.hidden_size)
        self.attn = GQAAttention(cfg)
        self.n2 = RMSNorm(cfg.hidden_size)
        self.mlp = SwiGLU(cfg.hidden_size, cfg.intermediate_size)

    def forward(self, x):
        x = x + self.attn(self.n1(x))
        return x + self.mlp(self.n2(x))


class APEXTransformer(nn.Module):
    def __init__(self, cfg: ModelConfig):
        super().__init__()
        self.cfg = cfg
        self.embed = nn.Embedding(cfg.vocab_size, cfg.hidden_size)
        self.blocks = nn.ModuleList(Block(cfg) for _ in range(cfg.num_layers))
        self.norm = RMSNorm(cfg.hidden_size)
        self.lm_head = nn.Linear(cfg.hidden_size, cfg.vocab_size, bias=False)
        self.lm_head.weight = self.embed.weight

    def forward(self, tokens, labels=None):
        x = self.embed(tokens)
        for block in self.blocks:
            x = block(x)
        logits = self.lm_head(self.norm(x))
        loss = None
        if labels is not None:
            loss = F.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1))
        return logits, loss


def load_tokens(path: Path, vocab_size: int):
    raw = path.read_bytes()
    # Deterministic byte-level fallback tokenizer. A production release should
    # replace this with a versioned APEX tokenizer and manifest.
    return torch.tensor([b % vocab_size for b in raw], dtype=torch.long)


def batches(tokens, seq_len, batch_size, device, start=0):
    usable = ((len(tokens) - start - 1) // seq_len) * seq_len
    if usable <= 0:
        raise ValueError("training corpus is too small for the configured sequence length")
    for off in range(start, start + usable, seq_len * batch_size):
        xs, ys = [], []
        for j in range(batch_size):
            s = off + j * seq_len
            if s + seq_len + 1 > len(tokens):
                break
            xs.append(tokens[s:s + seq_len])
            ys.append(tokens[s + 1:s + seq_len + 1])
        if xs:
            yield torch.stack(xs).to(device), torch.stack(ys).to(device)


def save_checkpoint(model, optimizer, step, model_cfg, train_cfg, out_dir, rank):
    if rank != 0:
        return
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    state = model.module if hasattr(model, "module") else model
    payload = {
        "format": "APEX-TRANSFORMER-1",
        "step": step,
        "model_config": asdict(model_cfg),
        "training_config": asdict(train_cfg),
        "model": state.state_dict(),
        "optimizer": optimizer.state_dict(),
    }
    tmp = out / f"checkpoint-{step}.pt.tmp"
    final = out / f"checkpoint-{step}.pt"
    torch.save(payload, tmp)
    os.replace(tmp, final)
    manifest = out / f"checkpoint-{step}.json"
    manifest.write_text(json.dumps({
        "format": payload["format"],
        "step": step,
        "model_config": asdict(model_cfg),
        "training_config": asdict(train_cfg),
        "checkpoint": str(final),
        "parameters": sum(p.numel() for p in state.parameters()),
    }, indent=2) + "\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", default="checkpoints/apex")
    ap.add_argument("--model-config", default="training/configs/apex-125m.json")
    ap.add_argument("--train-config", default="training/configs/train-smoke.json")
    args = ap.parse_args()

    distributed, rank, world = init_distributed()
    try:
        model_cfg = ModelConfig(**json.loads(Path(args.model_config).read_text()))
        train_cfg = TrainConfig(**json.loads(Path(args.train_config).read_text()))
        seed_everything(train_cfg.seed, rank)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = APEXTransformer(model_cfg).to(device)
        if distributed:
            model = nn.parallel.DistributedDataParallel(
                model, device_ids=[torch.cuda.current_device()] if device.type == "cuda" else None
            )
        optimizer = torch.optim.AdamW(
            model.parameters(), lr=train_cfg.learning_rate,
            betas=(0.9, 0.95), weight_decay=train_cfg.weight_decay
        )
        tokens = load_tokens(Path(args.data), model_cfg.vocab_size)
        autocast_dtype = torch.bfloat16 if train_cfg.dtype == "bfloat16" else torch.float16

        model.train()
        step = 0
        iterator = batches(tokens, model_cfg.max_seq_len, train_cfg.batch_size, device)
        while step < train_cfg.max_steps:
            optimizer.zero_grad(set_to_none=True)
            running = 0.0
            for _ in range(train_cfg.grad_accumulation):
                try:
                    x, y = next(iterator)
                except StopIteration:
                    iterator = batches(tokens, model_cfg.max_seq_len, train_cfg.batch_size, device)
                    x, y = next(iterator)
                with torch.autocast(device_type=device.type, dtype=autocast_dtype,
                                    enabled=device.type == "cuda"):
                    _, loss = model(x, y)
                    loss = loss / train_cfg.grad_accumulation
                loss.backward()
                running += float(loss.detach())
            torch.nn.utils.clip_grad_norm_(model.parameters(), train_cfg.grad_clip)
            optimizer.step()
            step += 1

            if rank == 0 and (step == 1 or step % 10 == 0):
                print(json.dumps({"step": step, "loss": running, "world_size": world}))
            if step % train_cfg.save_interval == 0:
                save_checkpoint(model, optimizer, step, model_cfg, train_cfg, args.out, rank)
    finally:
        cleanup_distributed()


if __name__ == "__main__":
    main()
