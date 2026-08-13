"""
LIVA GeoSense
GeoJSON Utilities

Provides functions for converting agricultural observations
and farm boundaries into GeoJSON-compatible structures.
"""

from typing import Dict, List, Tuple


def create_point(
    latitude: float,
    longitude: float,
    properties: Dict = None
) -> Dict:
    """
    Create a GeoJSON Point feature.

    GeoJSON coordinates use:
        [longitude, latitude]
    """

    if not -90 <= latitude <= 90:
        raise ValueError(
            "Latitude must be between -90 and 90."
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            "Longitude must be between -180 and 180."
        )

    return {
        "type": "Feature",

        "geometry": {
            "type": "Point",
            "coordinates": [
                longitude,
                latitude
            ]
        },

        "properties": properties or {}
    }


def create_polygon(
    coordinates: List[Tuple[float, float]],
    properties: Dict = None
) -> Dict:
    """
    Create a GeoJSON Polygon feature.

    Coordinates must be provided as:

        [(longitude, latitude), ...]

    The polygon should contain at least four points and
    the first and last points should be identical.
    """

    if len(coordinates) < 4:
        raise ValueError(
            "A polygon requires at least four coordinates."
        )

    # Ensure the polygon is closed.

    if coordinates[0] != coordinates[-1]:

        coordinates = coordinates + [
            coordinates[0]
        ]

    formatted_coordinates = []

    for longitude, latitude in coordinates:

        if not -180 <= longitude <= 180:
            raise ValueError(
                "Longitude must be between -180 and 180."
            )

        if not -90 <= latitude <= 90:
            raise ValueError(
                "Latitude must be between -90 and 90."
            )

        formatted_coordinates.append([
            longitude,
            latitude
        ])

    return {
        "type": "Feature",

        "geometry": {
            "type": "Polygon",
            "coordinates": [
                formatted_coordinates
            ]
        },

        "properties": properties or {}
    }


def create_feature_collection(
    features: List[Dict]
) -> Dict:
    """
    Create a GeoJSON FeatureCollection.
    """

    return {
        "type": "FeatureCollection",
        "features": features
}
