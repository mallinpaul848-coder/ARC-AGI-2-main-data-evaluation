# APEX Runtime Evaluation Contract

This contract defines the interface required to connect the actual APEX runtime to the verification harness without tying the evaluator to a third-party inference provider.

## Required command
The evaluator must be able to invoke one deterministic batch entry point equivalent to:

`apex-run --manifest <manifest> --output <output.jsonl>`

## Required output
One JSON object per test containing:
- test_id
- input_hash
- output
- correct
- error
- timeout
- latency_ms

## Runtime metadata
The submission must expose:
- APEX build identifier
- model/artifact identifier
- runtime version
- hardware identifier
- sampling configuration
- random seed, when applicable

## Boundary
This contract is an evaluation adapter. It does not claim that a model is proprietary, that weights are owned by APEX, or that any benchmark result is official until independently measured.
