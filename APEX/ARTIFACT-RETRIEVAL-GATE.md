# APEX Artifact Retrieval Gate

## Purpose
Prevent the verification system from treating a historical filename or specification as if it were the actual executable artifact.

## Required artifact record
For every recovered archive, record:
- exact filename
- byte size
- SHA-256
- retrieval timestamp
- source
- immutable storage location
- extraction status
- runtime entrypoint
- model artifact identity
- dependency manifest

## Acceptance rules
An archive is RECOVERED only when its exact bytes are available and hashed.
An archive is INSPECTED only after its contents are examined.
A runtime is EXECUTABLE only after the exact recovered artifact starts successfully.
A runtime is SELF_HOSTED_VERIFIED only after execution succeeds with external model-provider access blocked.
A result is INDEPENDENTLY_VERIFIED only after an independent evaluator reproduces or attests to it.
A result is OFFICIAL_LEADERBOARD only when the benchmark operator publishes it.

## Historical evidence
Historical APEX records may be preserved as provenance, but they cannot satisfy a current execution gate.

A historical P99, accuracy result, deterministic test, or model claim must not be copied into a current report without reproduction.

## Current state
ARTIFACT_NOT_RETRIEVED

The connected repository contains recovery metadata but not the exact historical archive bytes. This state must remain until the bytes are actually recovered.

## Prohibited substitutions
Do not substitute a different model, mock runtime, prerecorded outputs, synthetic benchmark results, an invented archive, or an undocumented hosted model for the exact APEX artifact.
