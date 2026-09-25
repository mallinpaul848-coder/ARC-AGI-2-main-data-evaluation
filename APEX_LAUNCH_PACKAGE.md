# APEX LLM AI — Launch & Independent Evaluation Package

## Release objective
Publicly reachable APEX inference service with reproducible, model-only inference and independent external evaluation.

## Required public API
- GET /health
- GET /v1/models
- GET /v1/verify
- POST /v1/chat/completions
- OpenAI-compatible request/response format
- HTTPS
- No authentication required for evaluator endpoints
- CORS enabled for browser-based verification
- Stable production hostname
- No fallback to another hosted model

## Evaluation rules
1. External evaluators must call the APEX endpoint directly.
2. Do not substitute OpenAI, Anthropic, Google, Hugging Face Inference, or another provider.
3. Do not use hidden arithmetic-answer tables or benchmark-specific shortcuts.
4. Record model identifier, version, endpoint, timestamp, request protocol, task set, score, latency, and evaluator identity.
5. Preserve raw evaluator output and a SHA-256 evidence manifest.
6. Clearly distinguish public self-run results from evaluator-verified results.

## Independent evaluation targets
### LiveBench
OpenAI-compatible API evaluation. Submit the public APEX endpoint and preserve the evaluator output.

### ARC-AGI-2
Public evaluation: 120 tasks, exact output-grid matching, pass@2. Official private/leaderboard evaluation requires the official competition route. ARC Prize states that public testing results and evaluation methodology are published for audited results.

### Additional independent evaluator
Any reputable public evaluator that accepts a direct OpenAI-compatible endpoint may be used, provided the evaluator actually queries APEX and publishes/reports the resulting score.

## Evidence bundle
- endpoint URL
- /health response
- /v1/models response
- /v1/verify response
- evaluator configuration
- raw evaluator result
- timestamp
- commit SHA
- model SHA-256
- test-set identifier/version
- score
- latency/cost where supplied by evaluator
- reproducibility instructions

## Release gate
APEX is not allowed to claim an independent score until an external evaluator has actually queried the production endpoint and returned a result.
