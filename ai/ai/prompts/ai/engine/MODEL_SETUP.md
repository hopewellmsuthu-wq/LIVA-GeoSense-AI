# LIVA GeoSense Local Model Setup

## Purpose

This document explains how to run the LIVA GeoSense AI engine
with a local GGUF language model.

## Runtime

LIVA GeoSense uses llama.cpp for local inference.

The model must:

- Use GGUF format
- Run locally
- Support CPU inference
- Operate without external AI APIs
- Fit within the competition hardware constraints

## Model Location

Place the selected model at:

models/model.gguf

Do not commit model weights to the GitHub repository.

## Local Server

The model will be exposed through:

http://127.0.0.1:8080

The LIVA GeoSense Python engine communicates with the local
server through the OpenAI-compatible chat completion endpoint.

## Offline Requirement

The model must remain usable after the machine is disconnected
from the internet.

No cloud AI service should be required during inference.

## Benchmarking

Before selecting the final model, measure:

- Model loading time
- First-token latency
- Tokens per second
- RAM consumption
- Response quality
- Stability
