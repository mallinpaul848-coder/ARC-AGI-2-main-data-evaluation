# APEX Recovery Failure Handling

## Problem

A persistent file-library recovery failure is not evidence that an APEX artifact does not exist.

## Recovery paths

Try, in order:

1. Conversation attachment or mounted artifact.
2. Persistent library artifact.
3. GitHub source/release/tag.
4. Immutable build artifact supplied to the verifier.

## Failure classification

- NOT_SEARCHED: recovery path has not been attempted.
- SEARCH_FAILED: tool or connector failed before establishing whether the artifact exists.
- NOT_FOUND: recovery search completed successfully and found no matching artifact.
- RECOVERED: exact bytes obtained and hashed.

A connector/tool error must be recorded as SEARCH_FAILED, not NOT_FOUND.

## Current state

SEARCH_FAILED applies to the latest persistent-library attempt because the tool returned an internal failure.

The APEX verification state remains ARTIFACT_NOT_RETRIEVED.

## Integrity rule

Never change the verification state because a search tool failed. Only exact artifact bytes plus a SHA-256 can advance the recovery gate.
