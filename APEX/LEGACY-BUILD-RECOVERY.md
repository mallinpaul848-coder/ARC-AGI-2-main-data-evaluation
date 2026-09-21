# APEX Legacy Build Recovery

## Recovered prior-build record

The prior APEX work identifies these build artifacts:

- APEX_LLM_AI_INDEPENDENT_LAUNCH_DETERMINISTIC.tar.gz
  - canonical ID: apex-deterministic
  - recorded deterministic test: 1,000/1,000 identical responses for 17 × 19
  - expected result: 323

- APEX_INDEPENDENT_FIX1.tar.gz
  - recorded SHA-256: 50fcea95fea1ea507708622312318bad8672f4b61b725fa4c0f36a9cc06f5464
  - endpoints: /health, /v1/models, /v1/apex/status, /v1/apex/self-test
  - recorded self-test: 7/7
  - recorded inference test: 500/500
  - recorded P99: 2.318 ms
  - recorded trained_foundation_model_attached: false

- APEX_LLM_AUTONOMOUS_BACKEND.tar.gz
  - prior backend included /api/chat, /api/web, /api/benchmark, and /api/improve

## Evidence classification

These are historical build records recovered from prior APEX work. They are not treated as current independent measurements unless the corresponding artifact is executed again from the exact bytes.

The deterministic and latency figures above remain historical claims until reproduced from the archived artifact.

## Recovery rule

Do not substitute a new model, placeholder runtime, prerecorded output, or invented artifact for the missing archive.

When the exact archive becomes available, verify its SHA-256, inspect its contents, and connect it to the APEX independence gate.
