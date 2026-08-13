"""
LIVA GeoSense
NDVI Calculation Module

NDVI = (NIR - RED) / (NIR + RED)

This module provides basic NDVI calculations for the
geospatial intelligence layer.
"""


def calculate_ndvi(nir, red):
    """
    Calculate NDVI from near-infrared and red reflectance.

    Parameters
    ----------
    nir : float
        Near-infrared reflectance.

    red : float
        Red reflectance.

    Returns
    -------
    float
        NDVI value.

    Raises
    ------
    ValueError
        If the inputs are invalid or the denominator is zero.
    """

    if nir is None or red is None:
        raise ValueError(
            "NIR and RED values are required."
        )

    denominator = nir + red

    if denominator == 0:
        raise ValueError(
            "NIR + RED cannot equal zero."
        )

    return (nir - red) / denominator


def classify_ndvi(ndvi):
    """
    Provide a simple interpretation of an NDVI value.

    These categories are approximate indicators and should
    not be treated as universal agricultural thresholds.
    """

    if ndvi < -0.1:
        return "Water or non-vegetated surface"

    if ndvi < 0.1:
        return "Bare soil or very low vegetation"

    if ndvi < 0.3:
        return "Low vegetation"

    if ndvi < 0.5:
        return "Moderate vegetation"

    if ndvi < 0.7:
        return "Healthy vegetation"

    return "Very high vegetation"


def compare_ndvi(previous, current):
    """
    Calculate the change between two NDVI observations.
    """

    if previous is None or current is None:
        raise ValueError(
            "Both previous and current NDVI values are required."
        )

    change = current - previous

    percentage_change = None

    if previous != 0:
        percentage_change = (
            (change / abs(previous)) * 100
        )

    return {
        "previous": previous,
        "current": current,
        "change": change,
        "percentage_change": percentage_change
  }
