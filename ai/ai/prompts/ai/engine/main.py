"""
LIVA GeoSense AI
Phase 1B - Local Model Integration

Connects the LIVA GeoSense engine to a local llama.cpp server.

No cloud AI API is used.
"""

from pathlib import Path
import json
import sys
import urllib.request
import urllib.error


# ---------------------------------------------------------
# PROJECT PATHS
# ---------------------------------------------------------

ENGINE_DIR = Path(__file__).resolve().parent
AI_DIR = ENGINE_DIR.parent

CONFIG_FILE = ENGINE_DIR / "config" / "runtime.json"
MODEL_CONFIG_FILE = ENGINE_DIR / "config" / "model.json"

PROMPT_FILE = AI_DIR / "prompts" / "system_prompt.txt"


# ---------------------------------------------------------
# LOAD JSON
# ---------------------------------------------------------

def load_json(file_path):

    if not file_path.exists():

        raise FileNotFoundError(
            f"Configuration not found: {file_path}"
        )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ---------------------------------------------------------
# LOAD SYSTEM PROMPT
# ---------------------------------------------------------

def load_system_prompt():

    if not PROMPT_FILE.exists():

        raise FileNotFoundError(
            f"System prompt not found: {PROMPT_FILE}"
        )

    with open(
        PROMPT_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        return file.read().strip()


# ---------------------------------------------------------
# INPUT VALIDATION
# ---------------------------------------------------------

def validate_input(user_input):

    if user_input is None:

        return False, "No input was provided."

    user_input = user_input.strip()

    if not user_input:

        return False, "Please enter a question."

    if len(user_input) > 4000:

        return False, (
            "Input is too long. "
            "Maximum length is 4000 characters."
        )

    return True, user_input


# ---------------------------------------------------------
# CHECK LOCAL AI SERVER
# ---------------------------------------------------------

def check_server(model_config):

    runtime = model_config["runtime"]

    host = runtime["server_host"]
    port = runtime["server_port"]

    url = f"http://{host}:{port}/health"

    request = urllib.request.Request(
        url,
        method="GET"
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=5
        ) as response:

            return response.status == 200

    except (
        urllib.error.URLError,
        TimeoutError
    ):

        return False


# ---------------------------------------------------------
# LOCAL AI INFERENCE
# ---------------------------------------------------------

def ask_local_model(
    question,
    system_prompt,
    model_config
):

    runtime = model_config["runtime"]
    model = model_config["model"]

    host = runtime["server_host"]
    port = runtime["server_port"]

    endpoint = runtime["endpoint"]

    url = (
        f"http://{host}:{port}"
        f"{endpoint}"
    )

    payload = {

        "messages": [

            {
                "role": "system",
                "content": system_prompt
            },

            {
                "role": "user",
                "content": question
            }

        ],

        "temperature": model["temperature"],

        "top_p": model["top_p"],

        "max_tokens": model["max_tokens"],

        "stream": False
    }

    data = json.dumps(
        payload
    ).encode("utf-8")

    request = urllib.request.Request(

        url,

        data=data,

        headers={
            "Content-Type": "application/json"
        },

        method="POST"
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=120
        ) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        return result[
            "choices"
        ][0][
            "message"
        ][
            "content"
        ]

    except urllib.error.URLError as error:

        return (
            "Unable to connect to the local "
            "LIVA GeoSense AI model.\n\n"
            f"Error: {error}"
        )

    except (
        KeyError,
        IndexError,
        json.JSONDecodeError
    ):

        return (
            "The local AI server returned "
            "an unexpected response."
        )


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    try:

        config = load_json(
            CONFIG_FILE
        )

        model_config = load_json(
            MODEL_CONFIG_FILE
        )

        system_prompt = load_system_prompt()

    except FileNotFoundError as error:

        print(f"\nERROR: {error}")

        sys.exit(1)

    print()
    print("=" * 60)
    print("             LIVA GEOSENSE AI")
    print("=" * 60)

    print()

    print("Mode       : OFFLINE")
    print("Runtime    : llama.cpp")
    print("Model      : GGUF")
    print("Server     : 127.0.0.1:8080")

    print()

    if check_server(model_config):

        print("AI Server  : ONLINE")
        print("Model      : READY")

    else:

        print("AI Server  : OFFLINE")
        print()
        print(
            "Start llama-server before asking "
            "the AI a question."
        )

    print()

    print("Type 'exit' to quit.")

    print("=" * 60)

    while True:

        try:

            question = input(
                "\nLIVA GeoSense > "
            )

        except KeyboardInterrupt:

            print("\n\nEngine stopped.")
            break

        except EOFError:

            print("\n\nEngine stopped.")
            break

        if question.lower().strip() == "exit":

            print(
                "\nLIVA GeoSense shutting down."
            )

            break

        valid, result = validate_input(
            question
        )

        if not valid:

            print(
                f"\nInput Error: {result}"
            )

            continue

        if not check_server(
            model_config
        ):

            print(
                "\nThe local AI server "
                "is not running."
            )

            continue

        print(
            "\nLIVA GeoSense AI is thinking..."
        )

        response = ask_local_model(

            result,

            system_prompt,

            model_config

        )

        print("\n" + response)


if __name__ == "__main__":

    main()
