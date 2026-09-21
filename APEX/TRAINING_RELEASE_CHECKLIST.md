# APEX Training Release Checklist

Use this checklist before replacing the bootstrap model.

## Dataset
- [ ] Dataset names, versions, licenses and identifiers recorded.
- [ ] Dataset files hashed with SHA-256.
- [ ] Deterministic preprocessing/tokenization version recorded.
- [ ] Contamination/overlap checks completed.

## Model
- [ ] Architecture configuration frozen.
- [ ] Parameter count recorded.
- [ ] Context length recorded.
- [ ] Vocabulary/tokenizer recorded.
- [ ] Precision/quantization recorded.
- [ ] Random seed recorded.
- [ ] Checkpoint SHA-256 recorded.

## Training
- [ ] Training code commit recorded.
- [ ] Compute hardware recorded.
- [ ] Training configuration recorded.
- [ ] Validation data held out from training.
- [ ] Checkpoint selection rule fixed before test evaluation.

## Runtime
- [ ] Selected checkpoint loads through the APEX runtime.
- [ ] Model hash is reported by /v1/verify.
- [ ] Repeated identical inputs produce identical model output when deterministic mode is enabled.
- [ ] Inference works with outbound network disabled.
- [ ] No hosted model API is required.

## Evaluation
- [ ] Frozen benchmark version recorded.
- [ ] Raw outputs retained.
- [ ] Per-task correctness retained.
- [ ] Errors and timeouts retained.
- [ ] p50/p95/p99 latency retained.
- [ ] Independent evaluator evidence retained before using INDEPENDENTLY_VERIFIED.
- [ ] Official benchmark publication retained before using OFFICIAL_LEADERBOARD.

## Claim gate

Until all relevant evidence exists, APEX documentation must not claim frontier performance, an official leaderboard position, or independent validation.