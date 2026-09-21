# APEX Independent Verification Protocol

## 1. Freeze
Freeze the exact APEX build, model artifact, runtime configuration, benchmark manifest, and test inputs before measurement.

## 2. Execute
Run the identical input set without manual intervention. Record every raw output, error, timeout, and latency measurement.

## 3. Hash
Compute SHA-256 hashes for the manifest, input set, model artifact identifier, and raw output record.

## 4. Report
Report accuracy and P50/P95/P99 latency separately. Never replace measured values with target specifications.

## 5. External boundary
A result is **externally verified** only when an independent evaluator or benchmark operator executes or accepts the submission and publishes/attests the result. Local or self-hosted results remain local results.

## 6. ARC-AGI-2
For ARC-AGI-2, preserve the benchmark operator's task set, scoring rules, and submission requirements. Do not label a result as an official leaderboard score until the operator confirms it.

## Release gate
A release can claim:
- "locally measured" when reproducible local evidence exists;
- "independently verified" only with independent evidence;
- "official leaderboard result" only with an official leaderboard record.

No score, latency, ownership claim, or valuation is upgraded merely by documentation.
