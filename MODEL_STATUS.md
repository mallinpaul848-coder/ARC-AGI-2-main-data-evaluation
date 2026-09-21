# APEX Model Status

APEX now includes an executable local APEXMODEL1 bootstrap artifact at `models/apex-bootstrap.apex.json` and a server path that loads it directly without a hosted inference provider.

## Verified repository state

- Local model artifact: present
- Model format: APEXMODEL1
- API/runtime boundary: connected to the local artifact
- Hosted inference dependency: none in the checked-in runtime path
- Frontier-scale capability: **not established**

The bootstrap model is intentionally small and deterministic. It proves that the repository contains an actual model artifact and that the API can be wired to APEX-owned local inference.

A larger trained checkpoint is still required for any frontier capability claim or meaningful ARC-AGI-2 leaderboard submission.
