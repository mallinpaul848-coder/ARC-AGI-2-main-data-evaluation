# APEX LLM AI — External Verification Service

This repository contains the independently callable verification service for APEX.

## Endpoints
- GET /health
- GET /v1/verify

## Verification status
The service is reproducible and version-controlled. A public deployment is still required before its results can be called an external evaluation.

The verification API currently tests the deterministic APEX reasoning layer. It is not presented as an official ARC-AGI leaderboard result.

## Commit
This repository is the source of truth for the verification service.
