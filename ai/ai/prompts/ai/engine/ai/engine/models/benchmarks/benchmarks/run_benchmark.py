"""
LIVA GeoSense AI
Model Benchmark Runner - Phase 1B

Sends standardized benchmark questions to the local
llama.cpp server and records model responses.

The benchmark is designed to work completely offline.
"""

from pathlib import Path
from datetime import datetime
import json
import time
import urllib.request
import urllib.error


# ---------------------------------------------------------
# PATHS
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

QUESTIONS_FILE = (
    PROJECT_ROOT
    / "benchmarks"
    / "model_questions.json"
)

RESULTS_DIR = (
    PROJECT_ROOT
    / "benchmarks"
    / "results"
)

MODEL_CONFIG_FILE = (
    PROJECT_ROOT
    / "ai"
    / "engine"
    / "config"
    / "model.json"
)

PROMPT_FILE = (
    PROJECT_ROOT
    / "ai"
    / "prompts"
    / "system_prompt.txt"
)


# ---------------------------------------------------------
# LOAD JSON
# ---------------------------------------------------------

def load_json(path):

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ---------------------------------------------------------
# LOAD TEXT
# ---------------------------------------------------------

def load_text(path):

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as file:

        return file.read().strip()


# ---------------------------------------------------------
# CHECK SERVER
# ---------------------------------------------------------

def server_available(model_config):

    runtime = model_config["runtime"]

    url = (
        f"http://{runtime['server_host']}:"
        f"{runtime['server_port']}/health"
    )

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
# ASK MODEL
# ---------------------------------------------------------

def ask_model(
    question,
    system_prompt,
    model_config
):

    runtime = model_config["runtime"]
    model = model_config["model"]

    url = (
        f"http://{runtime['server_host']}:"
        f"{runtime['server_port']}"
        f"{runtime['endpoint']}"
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

    start_time = time.perf_counter()

    try:

        with urllib.request.urlopen(
            request,
            timeout=180
        ) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        elapsed = (
            time.perf_counter()
            - start_time
        )

        answer = (
            result["choices"][0]
            ["message"]["content"]
        )

        usage = result.get(
            "usage",
            {}
        )

        return {
            "success": True,
            "response": answer,
            "elapsed_seconds": round(
                elapsed,
                3
            ),
            "usage": usage
        }

    except Exception as error:

        elapsed = (
            time.perf_counter()
            - start_time
        )

        return {
            "success": False,
            "response": "",
            "elapsed_seconds": round(
                elapsed,
                3
            ),
            "usage": {},
            "error": str(error)
        }


# ---------------------------------------------------------
# MAIN BENCHMARK
# ---------------------------------------------------------

def main():

    print()
    print("=" * 65)
    print("       LIVA GEOSENSE AI MODEL BENCHMARK")
    print("=" * 65)
    print()

    # Check required files.

    required_files = [
        QUESTIONS_FILE,
        MODEL_CONFIG_FILE,
        PROMPT_FILE
    ]

    for path in required_files:

        if not path.exists():

            print(
                f"ERROR: Missing file:\n{path}"
            )

            return 1

    questions_data = load_json(
        QUESTIONS_FILE
    )

    model_config = load_json(
        MODEL_CONFIG_FILE
    )

    system_prompt = load_text(
        PROMPT_FILE
    )

    # Check local server.

    print("Checking local llama.cpp server...")

    if not server_available(
        model_config
    ):

        print()
        print(
            "ERROR: Local AI server is not running."
        )

        print(
            "Start llama.cpp before running "
            "the benchmark."
        )

        return 1

    print("Server status: READY")
    print()

    questions = questions_data[
        "questions"
    ]

    results = []

    benchmark_start = datetime.now()

    print(
        f"Questions: {len(questions)}"
    )

    print()

    # Run every benchmark question.

    for index, item in enumerate(
        questions,
        start=1
    ):

        print(
            f"[{index}/{len(questions)}] "
            f"{item['id']} - "
            f"{item['category']}"
        )

        result = ask_model(

            item["question"],

            system_prompt,

            model_config
        )

        record = {

            "id": item["id"],

            "category": item["category"],

            "question": item["question"],

            "response": result["response"],

            "success": result["success"],

            "elapsed_seconds":
                result["elapsed_seconds"],

            "usage": result["usage"]

        }

        if not result["success"]:

            record["error"] = result.get(
                "error",
                "Unknown error"
            )

        results.append(record)

        if result["success"]:

            print(
                f"    Response time: "
                f"{result['elapsed_seconds']}s"
            )

        else:

            print("    FAILED")

        print()

    benchmark_end = datetime.now()

    # -----------------------------------------------------
    # SAVE RESULTS
    # -----------------------------------------------------

    RESULTS_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    timestamp = benchmark_start.strftime(
        "%Y%m%d_%H%M%S"
    )

    output_file = (
        RESULTS_DIR
        / f"benchmark_{timestamp}.json"
    )

    output = {

        "benchmark": {
            "name":
                questions_data["benchmark"]["name"],

            "version":
                questions_data["benchmark"]["version"],

            "started_at":
                benchmark_start.isoformat(),

            "completed_at":
                benchmark_end.isoformat(),

            "model_runtime":
                model_config["runtime"]["name"],

            "model_format":
                model_config["model"]["format"]
        },

        "results": results
    }

    with open(
        output_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            output,
            file,
            indent=2,
            ensure_ascii=False
        )

    successful = sum(
        1
        for result in results
        if result["success"]
    )

    print("=" * 65)

    print(
        f"Completed: "
        f"{successful}/{len(results)}"
    )

    print(
        f"Results saved to:\n{output_file}"
    )

    print("=" * 65)

    return 0


# ---------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------

if __name__ == "__main__":

    raise SystemExit(
        main()
)
