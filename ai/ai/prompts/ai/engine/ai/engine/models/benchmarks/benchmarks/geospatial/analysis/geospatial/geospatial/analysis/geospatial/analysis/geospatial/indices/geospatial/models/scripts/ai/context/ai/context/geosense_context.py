"""
LIVA GeoSense
AI Context Builder

Converts geospatial analysis results into a structured
context that can be provided to the local AI model.

The AI must distinguish between:
- observed data
- calculated indicators
- risk signals
- recommendations

The AI should never invent missing measurements.
"""

from typing import Dict, Any


def build_ai_context(report: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build a clean AI-ready context from a GeoSense report.
    """

    farm = report.get("farm", {})
    observation = report.get("observation", {})
    vegetation = report.get(
        "vegetation_analysis",
        {}
    )
    risk = report.get(
        "risk_assessment",
        {}
    )

    context = {
        "system": {
            "name": "LIVA GeoSense",
            "purpose": (
                "Agricultural geospatial intelligence"
            )
        },

        "farm": {
            "id": farm.get("id"),
            "name": farm.get("name"),
            "crop": farm.get("crop"),
            "area_hectares":
                farm.get("area_hectares")
        },

        "observed_data": {
            "observation_date":
                observation.get("date"),

            "current_ndvi":
                observation.get("ndvi"),

            "previous_ndvi":
                observation.get(
                    "previous_ndvi"
                ),

            "rainfall_mm":
                observation.get(
                    "rainfall_mm"
                ),

            "soil_moisture":
                observation.get(
                    "soil_moisture"
                )
        },

        "calculated_analysis": {
            "vegetation_condition":
                vegetation.get(
                    "vegetation_condition"
                ),

            "vegetation_trend":
                vegetation.get(
                    "trend"
                ),

            "ndvi_change":
                vegetation.get(
                    "ndvi_change"
                ),

            "ndvi_percentage_change":
                vegetation.get(
                    "percentage_change"
                )
        },

        "risk_assessment": {
            "level":
                risk.get(
                    "risk_level"
                ),

            "score":
                risk.get(
                    "risk_score"
                ),

            "indicators":
                risk.get(
                    "indicators",
                    []
                )
        },

        "ai_instructions": [
            (
                "Use only the information supplied "
                "in this context."
            ),

            (
                "Do not invent satellite, rainfall, "
                "soil or weather measurements."
            ),

            (
                "Treat risk levels as screening signals, "
                "not definitive diagnoses."
            ),

            (
                "Clearly distinguish observations from "
                "interpretations."
            ),

            (
                "Recommend field verification when "
                "appropriate."
            )
        ]
    }

    return context
