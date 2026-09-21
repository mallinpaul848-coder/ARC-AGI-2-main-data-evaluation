# APEX LLM AI — Platform Architecture

APEX is being expanded from a single verification service into a standalone AI platform.

## Platform layers

1. **Model layer** — locally owned APEX model artifacts, versioned and SHA-256 identified.
2. **Inference layer** — deterministic local inference with no hosted model API dependency.
3. **API layer** — OpenAI-compatible chat endpoint plus APEX verification/provenance endpoints.
4. **Platform layer** — model registry, configuration, request limits, health, observability, and release metadata.
5. **Evaluation layer** — reproducible manifests, raw outputs, hashes, latency and correctness metrics.
6. **Training layer** — deterministic local training/export pipeline for progressively larger checkpoints.
7. **Independence layer** — inference remains functional when external network access and hosted model providers are unavailable.

## Scale-up contract

A larger APEX release must not replace the bootstrap artifact merely by changing metadata. A release becomes a capability release only when a larger checkpoint is actually produced, hashed, loaded by the runtime, and evaluated.

Each model release records:

- model identifier
- architecture/version
- parameter count
- context length
- vocabulary/tokenizer
- precision or quantization
- model SHA-256
- training corpus manifest/hash
- training configuration
- runtime commit
- benchmark manifests
- measured latency
- measured accuracy

## Current state

The platform/runtime foundation is operational, while the checked-in model remains a small bootstrap model. The next scale milestone is a substantially larger trained checkpoint. No frontier or leaderboard claim is implied until measured independently.
