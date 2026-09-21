# APEX LLM AI — Independent Evaluation Submission

## Submission status
READY_FOR_EXTERNAL_EVALUATION

This package contains the canonical evidence schema, benchmark manifest, verification protocol, report template, and structural CI checks.

## What is established
- The verification artifacts are version-controlled.
- The report format requires accuracy, errors, timeouts, P50/P95/P99 latency, and provenance hashes.
- Local, independent, and official leaderboard evidence are explicitly separated.

## What is not claimed
No benchmark score, leaderboard rank, model-weight ownership, or latency figure is claimed here unless backed by the corresponding execution evidence.

## Evaluator procedure
1. Freeze the submitted APEX build and model artifact identifier.
2. Freeze the benchmark version and test inputs.
3. Execute the benchmark under the published protocol.
4. Preserve raw outputs and logs.
5. Generate the verification report and hashes.
6. Publish or attest the result independently.

## Acceptance rule
Only the evaluator can designate an outcome as independently verified or official leaderboard evidence.
