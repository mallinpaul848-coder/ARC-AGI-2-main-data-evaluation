# APEX Independent Model Training Pipeline

## Objective

Produce a substantially trained APEX checkpoint that can replace the bootstrap artifact without changing the independent inference contract.

## Pipeline

1. Dataset acquisition — use legally available training data and record dataset identifiers, versions, licenses, and SHA-256 manifests.
2. Preprocessing — deterministic normalization/tokenization with a versioned preprocessing manifest.
3. Model initialization — initialize APEX architecture from a frozen configuration; record parameter count, context length, vocabulary, precision, and seed.
4. Training — train on APEX-controlled compute or another explicitly documented compute environment. No hosted inference provider is part of the inference path.
5. Validation — hold out validation data and record loss/perplexity and task-specific checks without modifying the frozen test sets.
6. Checkpointing — save immutable checkpoints and SHA-256 hashes.
7. Conversion — convert the selected checkpoint into APEXMODEL1 or a versioned successor format with a documented conversion hash.
8. Runtime verification — load the checkpoint through server.js; verify model hash, repeatability, schema, and offline execution.
9. Independent evaluation — freeze the checkpoint, benchmark manifest, sampling settings, runtime commit, hardware description, and raw outputs before reporting results.

## Independence contract

Inference must remain possible with only the APEX runtime and the selected model artifact. The production inference path must not require OpenAI, Anthropic, Google, Hugging Face, Vercel, or another external model API.

## Reproducibility record

Every evaluation release must contain:

- model SHA-256
- configuration SHA-256
- dataset/version manifest
- training code commit
- conversion code commit
- runtime commit
- tokenizer/preprocessor version
- parameter count
- context length
- precision/quantization
- seed and decoding configuration
- hardware
- benchmark/version
- per-task outputs
- aggregate metrics
- latency statistics
- timestamp

## Current state

The repository currently contains a small bootstrap checkpoint. That checkpoint validates the independent runtime contract but is not a frontier-capability model. A larger trained checkpoint is therefore the next model-capability milestone; no benchmark score is claimed until it is actually measured.
