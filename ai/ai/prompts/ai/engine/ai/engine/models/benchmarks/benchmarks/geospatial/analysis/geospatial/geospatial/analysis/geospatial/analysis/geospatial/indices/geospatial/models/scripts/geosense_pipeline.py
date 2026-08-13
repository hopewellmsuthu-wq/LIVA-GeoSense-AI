"""
LIVA GeoSense
Phase 1C.7 - GeoSense Intelligence Pipeline

Loads a farm observation and runs it through:

    Farm Data
        ↓
    Vegetation Analysis
        ↓
    Risk Assessment
        ↓
    GeoSense Intelligence Report
        ↓
    JSON Output

This phase does not require a live satellite connection
or a local AI model.
"""

from pathlib import Path
import json
import sys

from geospatial.analysis.report import (
    generate_geosense_report
)


# ---------------------------------------------------------
# PROJECT PATHS
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    PROJECT_ROOT
    / "data"
    / "sample"
    / "farm_observation.json"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "data"
    / "reports"
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "geosense_demo_report.json"
)


# ---------------------------------------------------------
# LOAD FARM DATA
# ---------------------------------------------------------

def load_farm_data():

    if not INPUT_FILE.exists():

        raise FileNotFoundError(
            f"Farm observation file not found: "
            f"{INPUT_FILE}"
        )

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ---------------------------------------------------------
# GENERATE REPORT
# ---------------------------------------------------------

def generate_report(data):

    farm = data.get(
        "farm",
        {}
    )

    location = data.get(
        "location",
        {}
    )

    observation = data.get(
        "observation",
        {}
    )

    analysis_context = data.get(
        "analysis_context",
        {}
    )

    # Combine location with observation data.

    observation_data = {

        **observation,

        "latitude":
            location.get("latitude"),

        "longitude":
            location.get("longitude"),

        "data_source":
            analysis_context.get(
                "data_source",
                "synthetic_demo"
            ),

        "observation_type":
            analysis_context.get(
                "observation_type",
                "synthetic_demo_data"
            )
    }

    return generate_geosense_report(
        farm=farm,
        observation=observation_data
    )


# ---------------------------------------------------------
# SAVE REPORT
# ---------------------------------------------------------

def save_report(report):

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            report,
            file,
            indent=2,
            ensure_ascii=False
        )


# ---------------------------------------------------------
# DISPLAY SUMMARY
# ---------------------------------------------------------

def display_summary(report):

    farm = report["farm"]

    vegetation = (
        report["vegetation_analysis"]
    )

    risk = (
        report["risk_assessment"]
    )

    print()

    print("=" * 65)
    print("             LIVA GEOSENSE")
    print("        INTELLIGENCE PIPELINE")
    print("=" * 65)

    print()

    print(
        f"Farm       : "
        f"{farm.get('name', 'Unknown')}"
    )

    print(
        f"Crop       : "
        f"{farm.get('crop', 'Unknown')}"
    )

    print(
        f"Area       : "
        f"{farm.get('area_hectares', 'Unknown')} ha"
    )

    print()

    print(
        f"Current NDVI : "
        f"{vegetation['current_ndvi']}"
    )

    print(
        f"Previous NDVI: "
        f"{vegetation.get('previous_ndvi')}"
    )

    print(
        f"NDVI Trend   : "
        f"{vegetation['trend']}"
    )

    print(
        f"Vegetation   : "
        f"{vegetation['vegetation_condition']}"
    )

    print()

    print(
        f"Risk Level   : "
        f"{risk['risk_level']}"
    )

    print(
        f"Risk Score   : "
        f"{risk['risk_score']}"
    )

    print()

    print("Indicators:")

    for indicator in risk["indicators"]:

        print(
            f"  • {indicator}"
        )

    print()

    print("Warnings:")

    for warning in risk["warnings"]:

        print(
            f"  • {warning}"
        )

    print()

    print(
        f"Report saved to:"
    )

    print(
        f"{OUTPUT_FILE}"
    )

    print()

    print("=" * 65)


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    print()

    print(
        "Starting LIVA GeoSense pipeline..."
    )

    try:

        data = load_farm_data()

        report = generate_report(
            data
        )

        save_report(
            report
        )

        display_summary(
            report
        )

    except (
        FileNotFoundError,
        ValueError,
        KeyError
    ) as error:

        print()

        print(
            f"PIPELINE ERROR: {error}"
        )

        return 1

    return 0


# ---------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------

if __name__ == "__main__":

    sys.exit(
        main()
)
