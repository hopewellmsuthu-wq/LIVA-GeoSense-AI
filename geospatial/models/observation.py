"""
LIVA GeoSense
Geospatial Observation Model

Represents a single agricultural/geospatial observation.
"""

from dataclasses import dataclass, asdict
from typing import Optional, Dict, Any


@dataclass
class GeoObservation:
    """
    A structured geospatial observation for a farm or
    agricultural area.
    """

    latitude: float
    longitude: float

    ndvi: Optional[float] = None

    previous_ndvi: Optional[float] = None

    rainfall_mm: Optional[float] = None

    soil_moisture: Optional[float] = None

    farm_area_hectares: Optional[float] = None

    observation_date: Optional[str] = None

    crop_type: Optional[str] = None

    notes: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the observation into a dictionary.
        """

        return asdict(self)

    def validate(self):
        """
        Validate the observation values.
        """

        if not -90 <= self.latitude <= 90:
            raise ValueError(
                "Latitude must be between -90 and 90."
            )

        if not -180 <= self.longitude <= 180:
            raise ValueError(
                "Longitude must be between -180 and 180."
            )

        if self.ndvi is not None:

            if not -1 <= self.ndvi <= 1:
                raise ValueError(
                    "NDVI must be between -1 and 1."
                )

        if self.previous_ndvi is not None:

            if not -1 <= self.previous_ndvi <= 1:
                raise ValueError(
                    "Previous NDVI must be between -1 and 1."
                )

        if self.rainfall_mm is not None:

            if self.rainfall_mm < 0:
                raise ValueError(
                    "Rainfall cannot be negative."
                )

        if self.soil_moisture is not None:

            if self.soil_moisture < 0:
                raise ValueError(
                    "Soil moisture cannot be negative."
                )

        if self.farm_area_hectares is not None:

            if self.farm_area_hectares <= 0:
                raise ValueError(
                    "Farm area must be greater than zero."
                )

        return True
