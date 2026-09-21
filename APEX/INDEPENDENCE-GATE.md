# APEX Independence Gate

## Purpose
This gate converts the independence architecture into an auditable release condition.

## Required evidence
A release may be marked **INDEPENDENTLY_OPERATIONAL** only when all gates below have passing evidence:

- [ ] Production APEX runtime source or immutable runtime artifact is identified.
- [ ] Exact model artifact/weights identity and provenance are recorded.
- [ ] APEX inference executes through the APEX-owned runtime boundary.
- [ ] No hosted third-party model API is required for inference.
- [ ] Network-disabled inference test passes, or all required runtime dependencies are explicitly documented and locally available.
- [ ] API, storage, security, and verification dependencies are inventoried.
- [ ] Reproducible benchmark outputs are generated from the frozen build.
- [ ] Raw outputs, errors, timeouts, and latency measurements are retained.
- [ ] Evidence files are SHA-256 hashed.
- [ ] An independent evaluator can reproduce the run from the published package.

## Hard status rules

| Status | Meaning |
|---|---|
| `ARCHITECTURE_DEFINED` | Design exists; production independence has not been demonstrated. |
| `RUNTIME_IDENTIFIED` | Production runtime/artifact is identified but not yet tested independently. |
| `SELF_HOSTED_VERIFIED` | Inference runs through the APEX runtime without a hosted model API under the documented test conditions. |
| `INDEPENDENTLY_VERIFIED` | An independent evaluator has inspected/executed the system and attested to the result. |
| `OFFICIAL_LEADERBOARD` | A benchmark operator has published an official result. |

A status must never be promoted merely because documentation, a local score, a target specification, or a successful deployment exists.

## Network-isolation test

The strongest practical independence check is:

1. Freeze the exact APEX build and model artifact.
2. Start the APEX runtime in the documented environment.
3. Disable outbound network access except where explicitly required for infrastructure that is itself part of the declared APEX system.
4. Submit a fixed test corpus.
5. Require valid responses for every test.
6. Record all failures, timeouts, and latency.
7. Compare outputs against the published evidence manifest.
8. Hash the complete evidence package.

A failed network-isolation test does not prove APEX is dependent on a third-party model; it means the dependency graph has not yet been demonstrated to be self-contained.

## Current state

**ARCHITECTURE_DEFINED**

The connected repository does not currently contain the production APEX model/runtime artifact, so this gate intentionally remains closed.

## No false promotion

Do not replace missing evidence with simulated outputs, placeholder models, prerecorded benchmark results, or claimed latency numbers.
