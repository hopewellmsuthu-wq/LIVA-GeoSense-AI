"""
LIVA GeoSense
Advisory Engine Test
"""

from ai.advisory.engine import AdvisoryEngine


def main():

    context = {

        "farm": {
            "id": "LGS-DEMO-001",
            "crop": "Maize",
            "area_hectares": 12.5
        },

        "observed_data": {
            "current_ndvi": 0.49,
            "previous_ndvi": 0.68,
            "rainfall_mm": 42.0,
            "soil_moisture": 31.5
        },

        "calculated_analysis": {

            "vegetation_condition":
                "Moderate vegetation",

            "vegetation_trend":
                "declining",

            "ndvi_change":
                -0.19
        },

        "risk_assessment": {

            "level":
                "MODERATE",

            "score":
                7,

            "indicators": [
                "Moderate NDVI decline"
            ]
        }
    }

    question = (
        "My maize crop seems to be getting weaker. "
        "What could be happening and what should I check?"
    )

    engine = AdvisoryEngine()

    request = engine.create_request(
        context=context,
        farmer_question=question
    )

    print()
    print("=" * 65)
    print("LIVA GEOSENSE ADVISORY ENGINE TEST")
    print("=" * 65)
    print()

    print(request["prompt"])

    print()
    print("=" * 65)


if __name__ == "__main__":
    main()
