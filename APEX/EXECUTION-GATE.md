# APEX Execution Gate

A real GitHub Actions execution has now been observed for the APEX executable smoke workflow.

## Observed execution
- Workflow: APEX executable smoke verification
- Run ID: 35648765127
- Run number: 3
- Event: push
- Commit: 781819e0dcf1f46ea0af8ee4375e89e8dfa80bae
- Status: completed
- Conclusion: success
- Runtime: apex-run-node
- Model: apex-bootstrap-1.0
- Hardware reported: x64
- Smoke cases: 7
- Correct: 7/7
- Errors: 0
- Timeouts: 0
- Evidence artifact: apex-smoke-evidence
- Artifact ID: 10661337220
- Artifact SHA-256: fca7d76e06acee8ab4f991a1101226fda2c59f47972d6370517d8ec7a401cfd3

## Gate interpretation
This is measured executable smoke evidence, not a frontier-model benchmark. It establishes that the checked-in APEX bootstrap runtime executed successfully in GitHub Actions and produced raw evidence.

It does **not** establish:
- ARC-AGI-2 performance
- frontier-level capability
- independent third-party evaluation
- proprietary frontier-scale weights
- official leaderboard placement
- self-hosted network isolation

## Next promotion gate
The next substantive gate is execution of the production APEX model/runtime on a defined benchmark, with raw outputs, hashes, environment metadata, and reproducible evidence. Official leaderboard status requires the benchmark operator's accepted public result.
