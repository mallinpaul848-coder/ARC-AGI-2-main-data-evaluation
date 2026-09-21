# APEX Local Evaluation Plan

1. Connect the production APEX runtime to the runtime contract.
2. Freeze the exact build and model artifact.
3. Run the complete benchmark manifest.
4. Save raw JSONL outputs and execution logs.
5. Validate the report with `APEX/verify_report.py`.
6. Compute provenance hashes.
7. Package the evidence for independent evaluation.

## Hard gate
A missing production runtime is a release blocker for a real performance result. The system must report `NOT_MEASURED` rather than substituting historical, target, simulated, or assumed results.

## Completion condition
The evaluation is complete only when the actual APEX runtime produces a complete evidence package that can be independently rerun.
