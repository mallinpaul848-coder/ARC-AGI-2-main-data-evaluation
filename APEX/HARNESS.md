# APEX Verification Harness

Reproducible, model-agnostic verification specification for APEX LLM AI.

## Evidence rules
- Freeze benchmark, build, model/artifact identifier, runtime configuration, and inputs.
- Execute the published benchmark protocol without manual intervention.
- Capture raw outputs, correctness, errors, timeouts, and latency.
- Record P50, P95, and P99 latency from measured observations.
- Hash the manifest and raw-output record with SHA-256.
- Generate the APEX verification report.

## Evidence states
`NOT_MEASURED` -> no execution evidence.

`LOCAL_MEASURED` -> reproducible local execution evidence.

`INDEPENDENTLY_VERIFIED` -> independent evaluator execution or attestation.

`OFFICIAL_LEADERBOARD` -> benchmark operator publication or confirmation.

The harness must never upgrade one state to another automatically. Target specifications are never substituted for measurements.
