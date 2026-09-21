# APEX Capability Roadmap

The independence and verification layers are now executable. Capability work is the remaining major gap.

## Phase 1 — Executable baseline
- [x] Local model artifact
- [x] Model SHA-256 provenance
- [x] Deterministic runtime probe
- [x] Automated CI runtime verification
- [x] Deterministic smoke benchmark
- [x] Evidence artifact upload

## Phase 2 — Trained checkpoint
- [ ] Select and freeze a documented training corpus
- [ ] Implement deterministic preprocessing/tokenization
- [ ] Train a substantially larger APEX checkpoint
- [ ] Record parameter count, context length, vocabulary, precision, seed, hardware and training configuration
- [ ] Convert and hash the resulting APEX model artifact
- [ ] Re-run the complete CI verification suite

## Phase 3 — Capability evaluation
- [ ] Freeze held-out evaluation manifests
- [ ] Run per-task evaluation with raw outputs retained
- [ ] Report accuracy, errors, timeouts and latency percentiles
- [ ] Run adversarial/contamination checks
- [ ] Compare against published baselines only using matching benchmark versions and evaluation rules

## Phase 4 — Independent recognition
- [ ] Supply the immutable build/model/manifest packet to an independent evaluator
- [ ] Preserve evaluator-generated raw evidence
- [ ] Publish only the result actually reproduced or published
- [ ] Submit to an official leaderboard when its submission requirements are satisfied

## Non-negotiable evidence rule

A local result is labeled LOCAL_MEASURED. It becomes INDEPENDENTLY_VERIFIED only after an independent evaluator reproduces or attests to it. It becomes OFFICIAL_LEADERBOARD only when the benchmark operator publishes it.

No score, ranking, or performance claim is promoted between states without the corresponding evidence.