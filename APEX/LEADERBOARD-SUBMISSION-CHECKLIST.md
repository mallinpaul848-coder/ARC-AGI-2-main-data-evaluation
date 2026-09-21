# APEX LLM AI — Leaderboard Submission Checklist

## Gate 1 — Executable candidate
- [ ] Exact APEX artifact recovered
- [ ] SHA-256 recorded
- [ ] Runtime starts from the exact artifact
- [ ] Model artifact identity recorded
- [ ] Build is immutable

## Gate 2 — Reproducibility
- [ ] Benchmark version frozen
- [ ] Inputs frozen
- [ ] Runtime configuration frozen
- [ ] Hardware recorded
- [ ] Raw outputs preserved
- [ ] Errors and timeouts preserved
- [ ] P50/P95/P99 calculated
- [ ] Evidence hashes recorded

## Gate 3 — Independence
- [ ] External model-provider access tested
- [ ] No silent hosted-model fallback
- [ ] Independent evaluator can reproduce the run
- [ ] Evaluator identity and timestamp recorded

## Gate 4 — Official submission
- [ ] Benchmark operator's current submission rules reviewed
- [ ] Required format generated
- [ ] Required metadata supplied
- [ ] Submission accepted by benchmark operator
- [ ] Published leaderboard result linked to the exact build

## Status rule

A candidate is not labeled OFFICIAL_LEADERBOARD merely because it passes Gates 1–3. The benchmark operator must publish or otherwise officially confirm the result.

## Current state

ARTIFACT_NOT_RETRIEVED
