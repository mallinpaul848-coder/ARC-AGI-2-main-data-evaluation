# APEX LLM AI — Canonical Verification Specification

## Purpose
This directory is the canonical verification layer for APEX LLM AI.

### Evidence boundaries
- Local deterministic tests are reported as local tests.
- Backend tests are reported separately from local tests.
- External leaderboard results are reported only when issued by the evaluator.
- No benchmark score is converted into a claim of being #1 or "best" without an independent published result.

### Required record
Every benchmark record should contain:
- APEX build/version identifier
- benchmark manifest/version
- model identifier
- runtime/configuration
- timestamp
- test count
- raw outputs
- expected outputs
- correctness
- errors/timeouts
- P50/P95/P99 latency
- reproducibility hash

### Ownership boundary
A self-hosted API or inference adapter does not by itself prove ownership of model weights. Weight ownership must be demonstrated by the actual model artifacts and licensing/provenance records.

### External verification
The submission package is intended for independent evaluation such as ARC-AGI-2 or other benchmark operators. Official rankings remain the property of the benchmark operator.

## Canonical release naming
Product: APEX LLM AI
Verification package: APEX Independent Verification Core
Legacy Mallin branding must not be used in the APEX user-facing release.
