# APEX Independence Contract

APEX is designed to run as a standalone inference service without a hosted AI-provider dependency.

## Runtime independence
- Model artifact is loaded from `models/apex-bootstrap.apex.json`.
- Inference is performed locally by `server.js`; no OpenAI, Anthropic, Google, Hugging Face, or other model API is called.
- No API key is required for inference.
- No network request is required after the application files and model artifact are present.
- The Docker image contains the application runtime and model artifact.
- `/health`, `/v1/models`, `/v1/chat/completions`, and `/v1/verify` are served by the APEX process itself.

## What this does not claim
This makes the runtime provider-independent. It does not by itself prove that the model is state-of-the-art, independently benchmarked, or eligible for a third-party leaderboard. Those require the relevant external evaluation procedures.

## Offline acceptance test

Start the container or Node server, then verify:
1. `GET /health` reports `model_loaded: true`.
2. `GET /v1/models` reports an APEX-owned model and SHA-256 hash.
3. `GET /v1/verify` reports `source: APEX_MODEL_ONLY` and repeatable output.
4. Disable outbound network access after startup and repeat the same three checks.
5. Send the same chat prompt twice and require identical generated content.

A failure of any step means the build is not runtime-independent.
