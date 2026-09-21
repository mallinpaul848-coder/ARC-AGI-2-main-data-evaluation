# APEX Exact Artifact Recovery Request

## Objective

Recover the exact executable APEX LLM AI artifact needed to begin real verification.

## Accepted artifact

Provide one exact, immutable source:

- APEX runtime archive
- complete APEX source repository commit
- immutable build artifact

The artifact must include the production inference path and identify the model artifact it executes.

## Historical candidates

Previously recorded filenames include:

- APEX_LLM_AI_INDEPENDENT_LAUNCH_DETERMINISTIC.tar.gz
- APEX_INDEPENDENT_FIX1.tar.gz
- APEX_LLM_AUTONOMOUS_BACKEND.tar.gz

These names are recovery leads only. They are not treated as present or executable until their exact bytes are obtained.

## Verification immediately after recovery

1. Preserve the original bytes.
2. Compute SHA-256.
3. Record byte size.
4. Inventory contents.
5. Identify runtime entrypoint.
6. Identify model/weights artifact.
7. Inspect dependencies.
8. Run the exact artifact.
9. Execute the independence network-block test.
10. Generate the first real execution record.

## Non-substitution rule

Do not replace a missing APEX artifact with a different model, a mock, a hosted API, or a reconstructed implementation and label it as the historical APEX build.

## Current state

WAITING_FOR_EXACT_APEX_ARTIFACT
