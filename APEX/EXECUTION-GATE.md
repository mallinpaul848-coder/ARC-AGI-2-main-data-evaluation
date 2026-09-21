# APEX Execution Gate

The executable verification workflow is configured, but GitHub has not exposed a completed workflow run through the connected interface.

The repository therefore records no CI benchmark score until a real run produces raw evidence.

## Gate
- Runtime source: apex-run.js
- Model: models/apex-bootstrap.apex.json
- Smoke manifest: APEX/smoke-manifest.json
- Required cases: 7
- Required pass condition: 7/7
- Evidence artifact: apex-smoke-results.jsonl

## Rule
A source file, workflow definition, or expected result is not execution evidence. A score becomes measured only after the workflow executes and produces the raw artifact.

## Current state
CI_NOT_OBSERVED__LOCAL_EXECUTION_REQUIRED
