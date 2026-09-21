# APEX Runtime Recovery Checklist

Use this checklist against the exact APEX archive when it becomes available.

## 1. Identity
- [ ] Exact archive bytes obtained
- [ ] SHA-256 calculated
- [ ] File size recorded
- [ ] Archive preserved unchanged

## 2. Contents
- [ ] Runtime entrypoint identified
- [ ] API server identified
- [ ] Inference engine identified
- [ ] Model/weights artifact identified
- [ ] Tokenizer/config identified
- [ ] Dependency manifests identified
- [ ] Startup scripts identified
- [ ] Benchmark harness identified

## 3. Independence
- [ ] No hidden hosted-model fallback
- [ ] External model-provider calls identified
- [ ] Outbound provider access can be blocked
- [ ] Runtime still executes with provider access blocked
- [ ] Model artifact provenance documented

## 4. Reproduction
- [ ] Frozen build identifier
- [ ] Frozen model identifier
- [ ] Frozen runtime identifier
- [ ] Hardware recorded
- [ ] OS/runtime environment recorded
- [ ] Sampling configuration recorded
- [ ] Raw outputs preserved
- [ ] Errors and timeouts preserved
- [ ] Latencies preserved
- [ ] P50/P95/P99 calculated
- [ ] Output evidence hashed

## 5. Promotion
Do not advance the verification state unless every required item for the next state is evidenced.

Current state remains: ARTIFACT_NOT_RETRIEVED
