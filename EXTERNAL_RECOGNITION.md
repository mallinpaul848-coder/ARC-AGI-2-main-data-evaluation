# APEX External Recognition Plan

## Objective
Obtain recognition from independent evaluators without overstating results.

## ARC Prize
ARC-AGI-2 official submissions use the designated Kaggle competition and private evaluation. The 2026 rules require open-source solutions for prize eligibility and prohibit internet access during evaluation. The ARC Prize community leaderboard is a separate route for reproducible general-purpose systems; self-reported scores are identified as such unless ARC Prize verifies them.

APEX should maintain exact pass@2 handling, a reproducible local ARC harness, frozen evaluation artifacts, and per-task evidence with immutable model/build hashes.

## Independent model evaluation
Prepare an APEX model endpoint and evidence packet for independent benchmarking organizations. Artificial Analysis publishes independently conducted intelligence, speed, throughput, pricing and model metadata, making it a useful external-recognition target.

## Evidence packet
- model identifier
- model SHA-256
- runtime/build commit
- benchmark/version
- task-set/manifest SHA-256
- generation configuration
- raw outputs
- per-task correctness
- aggregate score
- P50/P95/P99 latency
- hardware
- timestamp
- known limitations

## Claim discipline
Do not call a result official, verified, leaderboard-ranked, or independently validated until the external organization actually performs or publishes the evaluation.

## Current blocker
The bootstrap model is intentionally small. Strong model recognition requires a substantially trained APEX checkpoint. The independent runtime and evidence infrastructure can be completed before that checkpoint exists.
