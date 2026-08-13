"""
LIVA GeoSense
Vegetation Analysis

Combines NDVI observations with simple agricultural
interpretation.
"""

from typing import Dict, Any

from geospatial.indices.ndvi import (
    classify_ndvi,
    compare_ndvi
)


def analyze_vegetation(
    current_ndvi: float,
    previous_ndvi: float = None
) -> Dict[str, Any]:
    """
    Analyse current vegetation condition and, when available,
    vegetation change.
    """

    result = {
        "current_ndvi": current_ndvi,
        "vegetation_condition": classify_ndvi(
            current_ndvi
        )
    }

    if previous_ndvi is not None:

        comparison = compare_ndvi(
            previous_ndvi,
            current_ndvi
        )

        result["previous_ndvi"] = previous_ndvi

        result["ndvi_change"] = (
            comparison["change"]
        )

        result["percentage_change"] = (
            comparison["percentage_change"]
        )

        if comparison["change"] < -0.1:

            result["trend"] = "significant decline"

        elif comparison["change"] < 0:

            result["trend"] = "declining"

        elif comparison["change"] > 0.1:

            result["trend"] = "significant improvement"

        elif comparison["change"] > 0:

            result["trend"] = "improving"

        else:

            result["trend"] = "stable"

    else:

        result["trend"] = "unknown"

    return result
