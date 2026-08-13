"""
LIVA GeoSense AI
Offline AI Engine - Phase 1 MVP

This module provides the foundation for the LIVA GeoSense
offline intelligence system.

Current phase:
- Loads runtime configuration
- Loads the system prompt
- Validates user input
- Builds an AI-ready prompt
- Provides a development/demo response

Future phase:
- Connect to llama.cpp
- Load a local GGUF model
- Perform real offline inference
"""

from pathlib import Path
import json
import sys


# ---------------------------------------------------------
# PROJECT PATHS
# ---------------------------------------------------------

ENGINE_DIR = Path(__file__).resolve().parent
AI_DIR = ENGINE_DIR.parent

CONFIG_FILE = ENGINE_DIR / "config" / "runtime.json"
PROMPT_FILE = AI_DIR / "prompts" / "system_prompt.txt"


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

def load_config():
    """Load the LIVA GeoSense runtime configuration."""

    if not CONFIG_FILE.exists():
        raise FileNotFoundError(
            f"Runtime configuration not found: {CONFIG_FILE}"
        )

    with open(CONFIG_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


# ---------------------------------------------------------
# SYSTEM PROMPT
# ---------------------------------------------------------

def load_system_prompt():
    """Load the LIVA GeoSense AI system instructions."""

    if not PROMPT_FILE.exists():
        raise FileNotFoundError(
            f"System prompt not found: {PROMPT_FILE}"
        )

    with open(PROMPT_FILE, "r", encoding="utf-8") as file:
        return file.read().strip()


# ---------------------------------------------------------
# INPUT VALIDATION
# ---------------------------------------------------------

def validate_input(user_input):
    """
    Validate user input before it reaches the AI engine.
    """

    if user_input is None:
        return False, "No input was provided."

    user_input = user_input.strip()

    if not user_input:
        return False, "Please enter a question."

    if len(user_input) > 4000:
        return False, "Input is too long. Maximum length is 4000 characters."

    return True, user_input


# ---------------------------------------------------------
# PROMPT BUILDER
# ---------------------------------------------------------

def build_prompt(system_prompt, user_input):
    """
    Combine the system instructions with the user's question.
    """

    return f"""
{system_prompt}

USER QUERY:
{user_input}

LIVA GEOSENSE RESPONSE:
""".strip()


# ---------------------------------------------------------
# DEVELOPMENT RESPONSE
# ---------------------------------------------------------

def development_response(user_input):
    """
    Temporary response used while the local GGUF model
    has not yet been connected.

    This allows us to test the application architecture
    without requiring an AI model.
    """

    return f"""
LIVA GeoSense Development Mode

Your question:
{user_input}

The AI inference engine is currently running in
development mode.

The next engine phase will connect LIVA GeoSense
to a local GGUF language model through llama.cpp.

OFFLINE STATUS:
Ready

MODEL STATUS:
Not loaded

GEOSPATIAL ENGINE:
Development

AGRICULTURAL ENGINE:
Development
""".strip()


# ---------------------------------------------------------
# ENGINE STATUS
# ---------------------------------------------------------

def get_engine_status(config):
    """Return the current engine configuration."""

    return {
        "application": config["application"]["name"],
        "version": config["application"]["version"],
        "mode": config["application"]["mode"],
        "runtime": config["model"]["runtime"],
        "model_format": config["model"]["format"],
        "target_os": config["hardware"]["target_os"],
        "cpu_inference": config["hardware"]["cpu_inference"],
        "gpu_required": config["hardware"]["gpu_required"],
        "offline_only": config["privacy"]["offline_only"],
        "external_ai_api": config["privacy"]["external_ai_api"]
    }


# ---------------------------------------------------------
# PRINT ENGINE STATUS
# ---------------------------------------------------------

def print_status(status):
    """Display engine status in a readable format."""

    print("\n" + "=" * 55)
    print("           LIVA GEOSENSE AI ENGINE")
    print("=" * 55)

    print(f"Application       : {status['application']}")
    print(f"Version           : {status['version']}")
    print(f"Mode              : {status['mode']}")
    print(f"Runtime           : {status['runtime']}")
    print(f"Model Format      : {status['model_format']}")
    print(f"Target OS         : {status['target_os']}")
    print(f"CPU Inference     : {status['cpu_inference']}")
    print(f"GPU Required      : {status['gpu_required']}")
    print(f"Offline Only      : {status['offline_only']}")
    print(f"External AI API   : {status['external_ai_api']}")

    print("=" * 55)


# ---------------------------------------------------------
# MAIN ENGINE
# ---------------------------------------------------------

def main():
    """Start the LIVA GeoSense AI engine."""

    try:
        config = load_config()
        system_prompt = load_system_prompt()

    except FileNotFoundError as error:
        print(f"\nERROR: {error}")
        sys.exit(1)

    status = get_engine_status(config)

    print_status(status)

    print("\nSystem prompt loaded successfully.")
    print("LIVA GeoSense AI Engine is ready.")

    print("\nType 'status' to view engine status.")
    print("Type 'exit' to close the engine.")

    while True:

        try:
            user_input = input("\nLIVA GeoSense > ")

        except KeyboardInterrupt:
            print("\n\nEngine stopped.")
            break

        except EOFError:
            print("\n\nEngine stopped.")
            break

        if user_input.lower().strip() == "exit":
            print("\nLIVA GeoSense shutting down.")
            break

        if user_input.lower().strip() == "status":
            print_status(status)
            continue

        valid, result = validate_input(user_input)

        if not valid:
            print(f"\nInput Error: {result}")
            continue

        # Build the prompt that will eventually be sent
        # to the local GGUF model.
        final_prompt = build_prompt(
            system_prompt,
            result
        )

        # For now, use development mode.
        response = development_response(result)

        print("\n" + response)

        # Keep the generated prompt available for
        # future llama.cpp integration.
        _ = final_prompt


# ---------------------------------------------------------
# APPLICATION ENTRY POINT
# ---------------------------------------------------------

if __name__ == "__main__":
    main()
