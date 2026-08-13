"""
LIVA GeoSense
Agricultural Risk Assessment Engine

Converts geospatial indicators into a structured risk signal.

IMPORTANT:
This is an early MVP screening system.
It does NOT diagnose crop disease, drought, pests,
or other agricultural problems.
"""

from typing import Dict, Any


def assess_vegetation_risk(
    current_ndvi: float,
    previous_ndvi: float = None,
    rainfall_mm: float = None,
    soil_moisture: float = None
) -> Dict[str, Any]:
    """
    Assess potential vegetation stress.

    The engine uses several indicators:

    - Current NDVI
    - NDVI change
    - Rainfall
    - Soil moisture

    The result is a screening signal rather than
    a definitive agricultural diagnosis.
    """

    risk_score = 0
    indicators = []
    warnings = []

    # -----------------------------------------------------
    # CURRENT NDVI
    # -----------------------------------------------------

    if current_ndvi < 0.1:

        risk_score += 4

        indicators.append(
            "Very low vegetation signal"
        )

    elif current_ndvi < 0.3:

        risk_score += 3

        indicators.append(
            "Low vegetation signal"
        )

    elif current_ndvi < 0.5:

        risk_score += 1

        indicators.append(
            "Moderate vegetation signal"
        )

    else:

        indicators.append(
            "Relatively healthy vegetation signal"
        )

    # -----------------------------------------------------
    # NDVI CHANGE
    # -----------------------------------------------------

    ndvi_change = None

    if previous_ndvi is not None:

        ndvi_change = (
            current_ndvi - previous_ndvi
        )

        if ndvi_change <= -0.2:

            risk_score += 4

            indicators.append(
                "Significant NDVI decline"
            )

        elif ndvi_change <= -0.1:

            risk_score += 3

            indicators.append(
                "Moderate NDVI decline"
            )

        elif ndvi_change < 0:

            risk_score += 1

            indicators.append(
                "Minor NDVI decline"
            )

        else:

            indicators.append(
                "No NDVI decline detected"
            )

    # -----------------------------------------------------
    # RAINFALL
    # -----------------------------------------------------

    if rainfall_mm is not None:

        if rainfall_mm < 10:

            risk_score += 3

            indicators.append(
                "Very low recent rainfall"
            )

        elif rainfall_mm < 25:

            risk_score += 2

            indicators.append(
                "Low recent rainfall"
            )

    # -----------------------------------------------------
    # SOIL MOISTURE
    # -----------------------------------------------------

    if soil_moisture is not None:

        if soil_moisture < 20:

            risk_score += 3

            indicators.append(
                "Low soil moisture indicator"
            )

        elif soil_moisture < 30:

            risk_score += 2

            indicators.append(
                "Moderately low soil moisture indicator"
            )

    # -----------------------------------------------------
    # RISK LEVEL
    # -----------------------------------------------------

    if risk_score >= 8:

        risk_level = "HIGH"

    elif risk_score >= 4:

        risk_level = "MODERATE"

    else:

        risk_level = "LOW"

    # -----------------------------------------------------
    # SAFETY / INTERPRETATION
    # -----------------------------------------------------

    if risk_level == "HIGH":

        warnings.append(
            "Multiple indicators suggest possible "
            "vegetation stress."
        )

        warnings.append(
            "Field verification is recommended."
        )

    elif risk_level == "MODERATE":

        warnings.append(
            "Some indicators suggest possible "
            "vegetation stress."
        )

        warnings.append(
            "Additional environmental or field "
            "information should be investigated."
        )

    else:

        warnings.append(
            "Available indicators do not show "
            "strong vegetation stress."
        )

    warnings.append(
        "This assessment is a screening signal and "
        "not a definitive agricultural diagnosis."
    )

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "current_ndvi": current_ndvi,
        "previous_ndvi": previous_ndvi,
        "ndvi_change": ndvi_change,
        "indicators": indicators,
        "warnings": warnings
}
