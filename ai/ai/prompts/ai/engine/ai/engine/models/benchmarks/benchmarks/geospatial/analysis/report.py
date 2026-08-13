"""
LIVA GeoSense
Geospatial Intelligence Report Generator

Combines:
- Farm observations
- Vegetation analysis
- Risk assessment

into one structured GeoSense report.

This report is designed to become the context
provided to the local AI engine.
"""

from datetime import datetime
from typing import Dict, Any

from geospatial.analysis.vegetation import (
    analyze_vegetation
)

from geospatial.analysis.risk import (
    assess_vegetation_risk
)


# ---------------------------------------------------------
# REPORT GENERATOR
# ---------------------------------------------------------

def generate_geosense_report(
    farm,
    observation
) -> Dict[str, Any]:
    """
    Generate a complete GeoSense intelligence report.

    Parameters
    ----------
    farm : dict
        Farm information.

    observation : dict
        Environmental and vegetation observations.

    Returns
    -------
    dict
        Structured GeoSense intelligence report.
    """

    current_ndvi = observation.get(
        "current_ndvi"
    )

    previous_ndvi = observation.get(
        "previous_ndvi"
    )

    rainfall_mm = observation.get(
        "rainfall_mm"
    )

    soil_moisture = observation.get(
        "soil_moisture"
    )

    # -----------------------------------------------------
    # VEGETATION ANALYSIS
    # -----------------------------------------------------

    vegetation = analyze_vegetation(

        current_ndvi=current_ndvi,

        previous_ndvi=previous_ndvi
    )

    # -----------------------------------------------------
    # RISK ANALYSIS
    # -----------------------------------------------------

    risk = assess_vegetation_risk(

        current_ndvi=current_ndvi,

        previous_ndvi=previous_ndvi,

        rainfall_mm=rainfall_mm,

        soil_moisture=soil_moisture
    )

    # -----------------------------------------------------
    # REPORT
    # -----------------------------------------------------

    report = {

        "system": {
            "name": "LIVA GeoSense",
            "version": "0.1.0",
            "generated_at":
                datetime.utcnow().isoformat() + "Z"
        },

        "data_quality": {
            "source": observation.get(
                "data_source",
                "unspecified"
            ),

            "observation_type":
                observation.get(
                    "observation_type",
                    "unknown"
                )
        },

        "farm": farm,

        "observation": {

            "date":
                observation.get(
                    "date"
                ),

            "ndvi":
                current_ndvi,

            "previous_ndvi":
                previous_ndvi,

            "rainfall_mm":
                rainfall_mm,

            "soil_moisture":
                soil_moisture
        },

        "vegetation_analysis": vegetation,

        "risk_assessment": risk,

        "recommendation_context": {

            "field_verification":
                risk["risk_level"] in [
                    "MODERATE",
                    "HIGH"
                ],

            "priority":
                risk["risk_level"],

            "message":
                (
                    "Use the available geospatial indicators "
                    "as screening information. Additional "
                    "field or environmental information may "
                    "be required before taking action."
                )
        }
    }

    return report
