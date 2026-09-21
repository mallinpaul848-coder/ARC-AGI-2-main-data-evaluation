# APEX Recovery and Reproduction Protocol

## Objective
Turn the historical APEX build record into reproducible evidence without confusing historical measurements with current measurements.

## Phase 1 — Artifact recovery
1. Obtain the exact archive bytes.
2. Compute SHA-256.
3. Compare the digest with the recorded digest when one exists.
4. Preserve the original archive unchanged.
5. Record filename, digest, size, and acquisition source.

## Phase 2 — Runtime inspection
Inspect the archive for the API server, inference runtime, model files, tokenizer files, configuration, dependency manifests, startup scripts, benchmark harness, and external model/API references.

A self-hosted API is not sufficient evidence of a self-contained inference system.

## Phase 3 — Reproduction
Run the exact recovered artifact under a frozen environment and capture build, model, runtime, hardware, OS/runtime versions, sampling parameters, test inputs, raw outputs, errors, timeouts, per-test latency, P50/P95/P99, and evidence hashes.

## Phase 4 — Independence test
Block outbound access to external model providers and run the recovered runtime.

Expected result for SELF_HOSTED_VERIFIED:
- Requests reach the APEX-owned inference boundary.
- Inference completes without a hosted third-party model API.
- No silent fallback occurs.
- Failures are explicit.
- Evidence is retained.

## Phase 5 — Benchmark verification
Historical benchmark numbers are labeled HISTORICAL.
A number becomes CURRENT_MEASURED only after reproduction from the exact recovered artifact.
A result becomes INDEPENDENTLY_VERIFIED only after an independent evaluator reproduces or attests to the test.
A result becomes OFFICIAL_LEADERBOARD only when the benchmark operator publishes the result.

## Hard rule
Never convert historical records into current scores by copying numbers forward.
Never manufacture missing model weights, outputs, latency measurements, or evaluator attestations.

## Current recovery state
RECOVERY_MANIFEST_READY

The repository contains the recovery protocol and historical build record. The remaining artifact-dependent step is execution of the exact archive bytes.