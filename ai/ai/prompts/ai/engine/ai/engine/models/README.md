# LIVA GeoSense Model Candidates

This directory documents the language models evaluated for
the LIVA GeoSense offline AI system.

## Candidate 001

### Model

Gemma 3 4B Instruct

### Quantization

Q4_K_M

### Format

GGUF

### Intended Runtime

llama.cpp

### Approximate Model Size

~2.5 GB

### Role

Primary Phase 1B benchmark candidate.

### Evaluation Criteria

The model will be evaluated using:

- Agricultural reasoning
- Geospatial reasoning
- Response quality
- Hallucination control
- Response latency
- Tokens per second
- RAM consumption
- CPU utilisation
- Offline reliability

### Important

The model is a benchmark candidate and is NOT automatically
the final production model.

The final model will be selected based on measured performance
on the target competition hardware.
