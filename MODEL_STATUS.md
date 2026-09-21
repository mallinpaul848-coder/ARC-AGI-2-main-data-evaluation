# APEX Model Status

APEX now has a completely local model format and dependency-free reference runtime. The runtime loads model parameters from a local file and performs deterministic inference without a hosted model provider.

The checked-in bootstrap model is not a frontier-scale trained model. It proves the APEX-owned model-loading and inference boundary only.

A frontier capability claim requires actual trained weights and independent evaluation. No third-party inference provider is required by this runtime.
