# APEX LLM AI — External Evaluation Packet

## Purpose

This packet defines exactly what an independent evaluator receives and what must be returned.

## Candidate

- Product: APEX LLM AI
- Verification suite: APEX Independent Verification Core
- Benchmark: evaluator-selected or benchmark-operator-approved
- Build: exact immutable artifact identifier
- Model: exact model artifact identifier
- Runtime: exact runtime identifier

## Evaluator receives

1. Exact APEX artifact or approved executable build.
2. Benchmark manifest.
3. Verification schema.
4. Execution protocol.
5. Reproduction instructions.
6. Hashes for all supplied immutable inputs.
7. No precomputed benchmark answers presented as test results.

## Evaluator records

- benchmark name and version
- test count
- correct results
- incorrect results
- errors
- timeouts
- accuracy
- p50 latency
- p95 latency
- p99 latency
- hardware
- operating system
- runtime version
- model version
- sampling configuration
- raw output evidence
- input/output hashes
- evaluator identity
- evaluation timestamp

## Independence requirement

The evaluator must execute the supplied APEX build rather than accept a claimed score.

If the benchmark has an official submission and leaderboard process, only the benchmark operator's published result is treated as OFFICIAL_LEADERBOARD.

## Result states

LOCAL_MEASURED — APEX-controlled execution.

INDEPENDENTLY_VERIFIED — independent evaluator reproduced or attested to the result.

OFFICIAL_LEADERBOARD — benchmark operator published the result.

## Current status

Submission packet is prepared.

The packet does not assert a benchmark score or leaderboard position until the executable APEX artifact has been recovered and independently evaluated.
