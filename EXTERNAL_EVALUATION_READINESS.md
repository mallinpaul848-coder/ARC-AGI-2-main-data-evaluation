# APEX External Evaluation Readiness

This file is the handoff checklist for an independent evaluator. It separates **evaluation readiness** from **evaluation results**.

## Current status

- Independent local inference runtime: implemented.
- Model-only verification path: implemented.
- SHA-256 model and manifest provenance: implemented.
- Repeatability/determinism probe: implemented.
- Hosted-provider inference dependency: none in the checked-in runtime.
- Independent benchmark result: **not yet established**.
- Official ARC-AGI-2 leaderboard result: **not yet established**.
- Frontier capability claim: **not established by the bootstrap checkpoint**.

## Evaluator entry points

### Health and model identity

`GET /health`

Expected evidence includes the active model identity and model hash.

`GET /v1/models`

Expected evidence includes the model identifier and SHA-256 identity.

### Determinism/provenance

`GET /v1/verify`

This endpoint is a runtime-integrity probe. It repeats the same model-only probe and reports whether outputs match, together with hashes and latency. It is **not** a benchmark score.

### General inference

`POST /v1/chat/completions`

The response includes model provenance identifying the APEX model-only source. Evaluators should archive the complete request/response pair.

## Required independent-evaluation packet

Before an external run, freeze and archive:

1. Git commit SHA.
2. Model artifact SHA-256.
3. Manifest/task-set SHA-256.
4. Runtime version.
5. Hardware and accelerator configuration.
6. Sampling/generation configuration.
7. Exact benchmark version and evaluation rules.
8. Raw per-task outputs.
9. Per-task correctness.
10. Aggregate score and confidence/uncertainty information when applicable.
11. P50/P95/P99 latency where the benchmark permits timing.
12. Timestamp and timezone.
13. Error/timeout log.
14. Any evaluator-side modifications.

## Anti-cheating requirements

The benchmark harness must not use benchmark-answer lookup tables, test-ID shortcuts, or arithmetic shortcuts to produce model results.

The independent evaluator should run a frozen task set whose task content is not embedded in the inference router as expected answers.

For ARC-AGI-2, use the applicable official evaluation procedure and do not substitute a local heuristic score for an official result.

## Recognition routes

### ARC Prize

Use the official ARC Prize/Kaggle route for an official ARC-AGI-2 evaluation. Community-leaderboard publication is a separate route and must be labeled according to ARC Prize's verification status.

### Independent model evaluation

Provide the endpoint/evidence packet to an evaluator such as Artificial Analysis when the APEX checkpoint is sufficiently capable for meaningful evaluation.

## Publication rule

APEX may publish a result only with all of:

- evaluator name;
- benchmark and version;
- model/version;
- exact task population;
- score;
- date;
- evidence or result URL;
- verification status.

Until those fields exist, APEX should publish **evaluation readiness**, not a score or rank.

## Capability milestone

The next substantive recognition milestone is a trained APEX checkpoint large enough to make independent frontier evaluation meaningful. The verification infrastructure can be completed and frozen before that checkpoint exists.
