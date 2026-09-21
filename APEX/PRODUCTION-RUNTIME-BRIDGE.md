# APEX Production Runtime Bridge

This bridge is the final integration boundary between the real APEX runtime and the independent verification harness.

## Required adapter
Implement an adapter named `apex-run` that accepts:

`--manifest <path> --output <path>`

The adapter must invoke the real APEX production inference runtime. It must not substitute a mock model, placeholder response, third-party hosted model, or prerecorded result.

## Required record
For every test, write JSONL containing `test_id`, `input_hash`, `output`, `correct`, `error`, `timeout`, and `latency_ms`.

## Required metadata
The adapter must record the exact APEX build ID, model/artifact ID, runtime version, hardware/runtime environment, and sampling configuration.

## Release gate
If the real APEX runtime is unavailable, the adapter exits with a clear `RUNTIME_UNAVAILABLE` status. It must never manufacture benchmark results.

## Integration objective
Once the actual APEX runtime is available to this repository, the verification workflow can execute the real system and produce evidence suitable for independent submission.
