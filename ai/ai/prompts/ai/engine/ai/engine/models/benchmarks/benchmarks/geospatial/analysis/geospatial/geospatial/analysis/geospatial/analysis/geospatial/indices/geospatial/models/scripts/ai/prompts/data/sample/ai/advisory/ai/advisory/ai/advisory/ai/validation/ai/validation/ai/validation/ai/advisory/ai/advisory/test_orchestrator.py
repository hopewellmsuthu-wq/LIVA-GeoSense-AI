"""
LIVA GeoSense
Advisory Orchestrator Test

Uses a mock AI model.

The mock model will later be replaced by the
actual local GGUF inference function.
"""

import json

from ai.advisory.orchestrator import (
    GeoSenseOrchestrator
)


# ---------------------------------------------------------
# MOCK LOCAL MODEL
# ---------------------------------------------------------

def mock_model(prompt: str) -> str:
    """
    Temporary AI model.

    This allows us to test the complete architecture
    before connecting the real local GGUF model.
    """

    return """
## Situation

The available GeoSense data shows that vegetation
activity has declined from an NDVI value of 0.68 to 0.49.

## What the data may indicate

The decline may indicate vegetation stress.
However, the available data cannot determine the
exact cause.

## What we cannot determine

The available information cannot confirm whether
the cause is disease, pests, nutrient deficiency,
water stress or another factor.

## Recommended next steps

Inspect the affected field and compare the areas
showing weaker vegetation with healthier areas.
Field verification by the farmer or an agronomist
may help identify the cause.

## Confidence

MODERATE

The assessment is based on the supplied geospatial
indicators and does not include a complete field
assessment.
""".strip()


# ---------------------------------------------------------
# DEMO REPORT
# ---------------------------------------------------------

def create_demo_report():

    return {

        "farm": {

            "id":
                "LGS-DEMO-001",

            "name":
                "LIVA GeoSense Demonstration Farm",

            "crop":
                "Maize",

            "area_hectares":
                12.5
        },

        "observation": {

            "date":
                "2026-08-13",

            "ndvi":
                0.49,

            "previous_ndvi":
                0.68,

            "rainfall_mm":
                42.0,

            "soil_moisture":
                31.5
        },

        "vegetation_analysis": {

            "current_ndvi":
                0.49,

            "previous_ndvi":
                0.68,

            "ndvi_change":
                -0.19,

            "trend":
                "declining",

            "vegetation_condition":
                "Moderate vegetation"
        },

        "risk_assessment": {

            "risk_level":
                "MODERATE",

            "risk_score":
                7,

            "indicators": [

                "Moderate NDVI decline"
            ]
        }
    }


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    report = create_demo_report()

    question = (
        "My maize crop seems to be getting weaker. "
        "What could be happening and what should I check?"
    )

    orchestrator = GeoSenseOrchestrator(
        model_function=mock_model
    )

    result = orchestrator.run(
        geosense_report=report,
        farmer_question=question
    )

    print()
    print("=" * 70)
    print("          LIVA GEOSENSE AI ADVISORY")
    print("=" * 70)

    print()

    print(
        "Question:"
    )

    print(
        result["question"]
    )

    print()

    print(
        "AI Response:"
    )

    print(
        result["ai_response"]
    )

    print()

    print(
        "Validation Status:"
    )

    print(
        result["validation"]["status"]
    )

    print()

    print(
        "Pipeline Status:"
    )

    print(
        result["status"]
    )

    print()

    print(
        "=" * 70
    )


if __name__ == "__main__":

    main()
