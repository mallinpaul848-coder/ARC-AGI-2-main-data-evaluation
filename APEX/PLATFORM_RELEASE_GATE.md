# APEX LLM AI — Platform Release Gate

A release may be called a platform release only when all applicable gates are satisfied.

## Runtime
- [x] Standalone HTTP runtime
- [x] Local model loading
- [x] Model SHA-256 provenance
- [x] Deterministic repeatability probe
- [x] Request size and timeout protections
- [x] Health and model discovery endpoints

## Independence
- [x] No hosted model provider in the checked-in inference path
- [x] No API key required by the runtime
- [x] Network not required for inference after application and model are present
- [x] Local Docker runtime definition

## Verification
- [x] Versioned verification schema
- [x] Reproducible smoke manifest
- [x] Per-test hashes and latency recording
- [x] Frozen evaluation packet specification
- [ ] Independent evaluator execution
- [ ] Official leaderboard publication

## Model capability
- [x] Valid APEXMODEL1 bootstrap artifact
- [x] Deterministic local training/export scaffold
- [ ] Substantially larger trained checkpoint
- [ ] Held-out capability evaluation
- [ ] External benchmark evaluation

## Release rule

The current repository satisfies the platform/runtime foundation, but it must not claim frontier capability, independent benchmark verification, or leaderboard placement until the unchecked capability and external-evaluation gates are completed.
