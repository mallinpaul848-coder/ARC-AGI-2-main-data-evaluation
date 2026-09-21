# APEX Verification Status

This repository now executes the local APEX runtime verification in GitHub Actions.

## Automatically checked
- Node runtime syntax for `server.js` and `apex-run.js`
- JSON/model artifact validity
- APEX runtime startup
- `/health` model-load status
- `/v1/models` model identity and provenance
- `/v1/verify` deterministic repeatability
- SHA-256 model provenance
- deterministic smoke benchmark
- machine-readable verification artifacts

## Evidence boundary

A passing workflow establishes that the checked-in APEX runtime and bootstrap model satisfy the stated local execution checks. It does **not** establish:
- frontier-model capability
- ARC-AGI-2 performance
- an official leaderboard position
- independent external validation
- commercial valuation

Those require separately executed evaluations with the corresponding evidence.

## Current capability boundary

The checked-in `apex-bootstrap-1.0` model is intentionally small. The next capability milestone is a substantially trained APEX checkpoint evaluated against frozen held-out suites.

## External recognition

The repository's benchmark manifest explicitly requires an external result before any official leaderboard claim is allowed.