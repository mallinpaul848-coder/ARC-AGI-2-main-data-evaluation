# APEX Model Status

## Current state

- Local model artifact: present
- Model format: APEXMODEL1
- Local inference path: connected
- Provider dependency in checked-in runtime: none
- Verification path: model-only
- Provenance: SHA-256 model and manifest hashes
- Determinism probe: implemented
- Benchmark accuracy: **not yet established**
- Frontier capability: **not established**
- Official ARC-AGI leaderboard result: **not established**

The bootstrap model is intentionally small. It proves the repository contains an executable model artifact and a local inference path. It should not be marketed as a frontier model.

## Next capability milestone
Replace the bootstrap checkpoint with a substantially trained APEX checkpoint, then run frozen benchmark suites through the same model-only execution path. Preserve per-task outputs and hashes so an independent evaluator can reproduce the result.
