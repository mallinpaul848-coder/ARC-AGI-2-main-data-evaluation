# APEX LLM AI — Platform API Contract

## Core endpoints

### GET /health
Returns service health, runtime version, loaded model, and model SHA-256.

### GET /v1/models
Returns the locally available APEX model identity and artifact hash.

### GET /v1/verify
Runs a deterministic repeatability probe and reports model provenance and latency. It is a runtime-integrity check, not a benchmark score.

### POST /v1/chat/completions
Accepts an OpenAI-compatible message array and generates from the selected local APEX model only.

## Platform guarantees

- Model identity is derived from the loaded artifact.
- Model provenance is exposed as SHA-256.
- Unknown/unavailable models are rejected.
- Request size and request timeout limits are enforced.
- Inference does not call a hosted model provider.
- The same model artifact and deterministic configuration produce repeatable model output.

## Scale path

The API contract remains stable while the model artifact is upgraded. A larger trained checkpoint can therefore replace the bootstrap model without requiring a new public API surface.

## Evidence rule

API availability is not evidence of model quality. Capability claims require measured benchmark results from a frozen evaluation set and, for external recognition, an independent evaluator.
