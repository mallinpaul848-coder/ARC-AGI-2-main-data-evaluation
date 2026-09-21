# APEX Independence Architecture

## Objective
APEX is designed so that its production inference path does not depend on a hosted model provider for execution.

## Required independent layers
1. **APEX API** — owns request/response handling.
2. **APEX Runtime** — owns inference execution and runtime policy.
3. **Model Artifact Boundary** — identifies the exact model/weights artifact and provenance.
4. **Storage Boundary** — owns persistent application and verification data.
5. **Security Boundary** — owns authentication, authorization, secrets, and rate controls.
6. **Verification Boundary** — owns reproducible tests, evidence, hashes, and reports.
7. **Deployment Boundary** — permits self-hosted infrastructure without requiring a specific cloud vendor.

## Dependency rule
Third-party infrastructure may be used for development, hosting, or evaluation transport, but the APEX inference path must not silently fall back to a third-party hosted model. Any unavailable internal component must fail explicitly.

## Independence evidence
Independence is established by inspecting and executing the production system, not by branding or documentation alone. The final evidence package should identify every runtime dependency and demonstrate that the APEX inference path remains operational without an external model API.

## Current status
`ARCHITECTURE_DEFINED`

This repository does not contain the production APEX model/runtime artifact, so it cannot honestly mark the runtime itself as independently operational yet.
