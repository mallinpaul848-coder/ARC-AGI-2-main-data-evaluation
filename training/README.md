# APEX large-model training

The Transformer training path produces APEX-TRANSFORMER-1 decoder-only Transformer checkpoints.

## Ladder

- 125M: architecture/runtime smoke and first controlled training checkpoint.
- 1B: capability development checkpoint.
- 7B: large-model release candidate.

A configuration file describes architecture; it does not mean a checkpoint of that size has been trained. A release is only a trained, hashed, loadable checkpoint with recorded data provenance and independent evaluation.

## Independence

Training may use local/open-source compute libraries. Production inference must use the APEX runtime and a versioned APEX model artifact without a hosted model-provider API.

## Verification gate

Before public claims: record parameter count, tokenizer version, dataset manifest and licenses, training configuration, checkpoint SHA-256, runtime version, hardware, precision, evaluation outputs, latency and reproducibility metadata.
