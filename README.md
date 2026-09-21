# APEX LLM AI — External Verification Service

This repository contains the independently callable verification service for APEX.

## Endpoints
- GET /health
- GET /v1/models
- GET /v1/verify
- POST /v1/chat/completions

## Verification policy
The runtime is **model-only** for inference and verification. Benchmark results must not be produced by a hidden arithmetic shortcut or local benchmark-answer table.

`/v1/verify` checks model loading, model provenance, SHA-256 identity, repeatability, and latency. It deliberately does **not** claim benchmark accuracy or leaderboard status.

`apex-run.js` records per-test output, expected value, correctness, latency, model hash, manifest hash, runtime, hardware, and deterministic sampling status.

## Current model status
The checked-in bootstrap artifact is intentionally small. It establishes a real APEX-owned local model artifact and inference path, but it does not establish frontier capability.

Meaningful benchmark claims require a larger trained checkpoint and an independent evaluator using a frozen, disclosed task set.

## Independence
The checked-in runtime path does not require OpenAI, Hugging Face, Vercel, or another hosted inference provider.
