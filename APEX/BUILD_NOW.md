# APEX LLM AI — Build-Now Capability Path

The platform foundation is complete. The next executable milestone is a real trained checkpoint.

## Build sequence

1. Prepare a documented local corpus.
2. Run: python3 apex-train.py --input <corpus> --output <checkpoint>.
3. Record corpus SHA-256 and checkpoint SHA-256.
4. Load the checkpoint with APEX_MODEL=<checkpoint> node server.js.
5. Run /health, /v1/models, and /v1/verify.
6. Run the frozen smoke/evaluation manifests.
7. Add held-out tasks that were not used during training.
8. Record accuracy, errors, timeouts, p50, p95, and p99 latency.
9. Freeze the checkpoint and evidence bundle.
10. Submit the frozen artifact to an independent evaluator when access is available.

## Important limitation

The repository cannot honestly manufacture a large trained model or an external benchmark result without the corresponding training corpus, compute, execution, and evaluation. This document therefore defines executable engineering steps rather than fabricating completion.

## Independence target

The final inference path remains local to the APEX runtime and model artifact. External evaluation may be used for recognition, but it must not become a hidden dependency of production inference.
