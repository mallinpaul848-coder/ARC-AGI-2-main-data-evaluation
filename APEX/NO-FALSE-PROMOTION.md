# APEX No-False-Promotion Policy

This repository must never promote an APEX result based only on documentation, target specifications, historical records, or simulated output.

## Evidence classes

| State | Meaning |
|---|---|
| ARTIFACT_NOT_RETRIEVED | Exact executable artifact unavailable |
| RECOVERED | Exact bytes obtained and hashed |
| INSPECTED | Contents and dependencies inspected |
| EXECUTABLE | Exact artifact successfully executed |
| SELF_HOSTED_VERIFIED | Execution succeeds with external model-provider access blocked |
| INDEPENDENTLY_VERIFIED | Independent evaluator reproduced or attested to the result |
| OFFICIAL_LEADERBOARD | Benchmark operator published the result |

## Hard rules

1. Historical measurements remain historical.
2. Claimed latency is not measured latency.
3. Claimed accuracy is not benchmark accuracy.
4. A self-hosted API is not proof of proprietary model weights.
5. A local benchmark is not independent verification.
6. Independent verification is not official leaderboard placement.
7. Missing runtime or model artifacts must produce an explicit unavailable state.
8. No fabricated outputs, hashes, timestamps, evaluator attestations, or leaderboard entries.

## Current enforcement target

The current APEX verification state is:

ARTIFACT_NOT_RETRIEVED

No higher state may be asserted until its evidence requirements are satisfied.
