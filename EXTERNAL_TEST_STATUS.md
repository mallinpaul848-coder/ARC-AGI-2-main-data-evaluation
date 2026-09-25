# APEX External Test Status

## Current state
The APEX codebase has a model-only API path and an external-evaluation package.

## Hard release requirement
A genuine independent score requires an evaluator to reach the production endpoint.

## Do not mislabel
- Internal tests are not independent scores.
- GitHub Actions self-tests are not independent capability evaluations.
- A score from a different provider's model is not an APEX score.
- A self-reported public-eval number is not an evaluator-verified leaderboard result.

## Release evidence
Once an external evaluator reaches the endpoint, add:
- evaluator name
- benchmark/version
- exact score
- date
- endpoint
- model/version
- raw result artifact
- evaluator URL/report

## Current blocker
The connected deployment access layer currently blocks external access to the deployed Vercel service. This must be cleared before a real external evaluator can query APEX. No fabricated score is permitted.
