# APEX LLM AI — Independent Evaluation Request

## System
APEX LLM AI

## Evaluation request
Please evaluate the deployed APEX OpenAI-compatible inference endpoint directly.

### Required tests
1. Model/API reachability
2. Deterministic repeatability where applicable
3. Standard benchmark capability score
4. Per-task results where the evaluator supports them
5. Latency
6. Failure/error rate
7. Model identifier and version
8. Reproducibility metadata

### Integrity requirements
- Do not route requests to another model.
- Do not accept benchmark-specific hard-coded answers.
- Identify the exact endpoint and model returned by /v1/models.
- Preserve raw results.
- Report the score independently of APEX.

## Result record
Evaluator: __________________
Endpoint: __________________
Model: _____________________
Benchmark/version: __________
Tasks: _____________________
Score: _____________________
Latency: ___________________
Date/time: __________________
Verification status: ________
Evidence URL: ______________

## Publication
The resulting evaluator record should be retained as a permanent release artifact and referenced from the APEX launch package.
