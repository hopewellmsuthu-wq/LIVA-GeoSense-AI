"""
LIVA GeoSense
Evidence & Confidence Engine

Provides explainable confidence scores for GeoSense
assessments.

IMPORTANT:
Confidence represents confidence in the available
evidence and analysis — not certainty about the real-world
cause of a problem.
"""

from typing import Dict, Any, List


class EvidenceEngine:
    """
    Builds an evidence trail for GeoSense assessments.
    """

    def __init__(
        self,
        context: Dict[str, Any]
    ):
        self.context = context

    # -----------------------------------------------------
    # BUILD EVIDENCE
    # -----------------------------------------------------

    def build_evidence(self) -> List[Dict[str, Any]]:
        """
        Convert available observations and calculations
        into a traceable evidence list.
        """

        evidence = []

        observed = self.context.get(
            "observed_data",
            {}
        )

        analysis = self.context.get(
            "calculated_analysis",
            {}
        )

        risk = self.context.get(
            "risk_assessment",
            {}
        )

        # -------------------------------------------------
        # NDVI
        # -------------------------------------------------

        current_ndvi = observed.get(
            "current_ndvi"
        )

        previous_ndvi = observed.get(
            "previous_ndvi"
        )

        if current_ndvi is not None:

            evidence.append({

                "type":
                    "observed",

                "indicator":
                    "Current NDVI",

                "value":
                    current_ndvi,

                "source":
                    "GeoSense observation",

                "importance":
                    "high"
            })

        if previous_ndvi is not None:

            evidence.append({

                "type":
                    "observed",

                "indicator":
                    "Previous NDVI",

                "value":
                    previous_ndvi,

                "source":
                    "GeoSense observation",

                "importance":
                    "high"
            })

        # -------------------------------------------------
        # NDVI CHANGE
        # -------------------------------------------------

        ndvi_change = analysis.get(
            "ndvi_change"
        )

        if ndvi_change is not None:

            evidence.append({

                "type":
                    "calculated",

                "indicator":
                    "NDVI change",

                "value":
                    ndvi_change,

                "source":
                    "Calculated from current "
                    "and previous NDVI",

                "importance":
                    "high"
            })

        # -------------------------------------------------
        # VEGETATION TREND
        # -------------------------------------------------

        trend = analysis.get(
            "vegetation_trend"
        )

        if trend:

            evidence.append({

                "type":
                    "calculated",

                "indicator":
                    "Vegetation trend",

                "value":
                    trend,

                "source":
                    "Vegetation analysis",

                "importance":
                    "medium"
            })

        # -------------------------------------------------
        # RAINFALL
        # -------------------------------------------------

        rainfall = observed.get(
            "rainfall_mm"
        )

        if rainfall is not None:

            evidence.append({

                "type":
                    "observed",

                "indicator":
                    "Rainfall",

                "value":
                    rainfall,

                "unit":
                    "mm",

                "source":
                    "GeoSense observation",

                "importance":
                    "medium"
            })

        # -------------------------------------------------
        # SOIL MOISTURE
        # -------------------------------------------------

        soil_moisture = observed.get(
            "soil_moisture"
        )

        if soil_moisture is not None:

            evidence.append({

                "type":
                    "observed",

                "indicator":
                    "Soil moisture",

                "value":
                    soil_moisture,

                "source":
                    "GeoSense observation",

                "importance":
                    "medium"
            })

        # -------------------------------------------------
        # RISK
        # -------------------------------------------------

        risk_level = risk.get(
            "level"
        )

        if risk_level:

            evidence.append({

                "type":
                    "calculated",

                "indicator":
                    "Risk level",

                "value":
                    risk_level,

                "source":
                    "GeoSense risk engine",

                "importance":
                    "high"
            })

        return evidence

    # -----------------------------------------------------
    # CONFIDENCE
    # -----------------------------------------------------

    def calculate_confidence(self) -> Dict[str, Any]:
        """
        Calculate a simple evidence-based confidence level.

        This is an MVP scoring mechanism.
        """

        observed = self.context.get(
            "observed_data",
            {}
        )

        analysis = self.context.get(
            "calculated_analysis",
            {}
        )

        score = 0
        reasons = []

        # Current NDVI

        if observed.get(
            "current_ndvi"
        ) is not None:

            score += 2

            reasons.append(
                "Current NDVI is available."
            )

        # Previous NDVI

        if observed.get(
            "previous_ndvi"
        ) is not None:

            score += 2

            reasons.append(
                "Historical NDVI is available."
            )

        # NDVI change

        if analysis.get(
            "ndvi_change"
        ) is not None:

            score += 2

            reasons.append(
                "NDVI change has been calculated."
            )

        # Rainfall

        if observed.get(
            "rainfall_mm"
        ) is not None:

            score += 1

            reasons.append(
                "Rainfall information is available."
            )

        # Soil moisture

        if observed.get(
            "soil_moisture"
        ) is not None:

            score += 1

            reasons.append(
                "Soil moisture information is available."
            )

        # -------------------------------------------------
        # CONFIDENCE LEVEL
        # -------------------------------------------------

        if score >= 7:

            level = "HIGH"

        elif score >= 4:

            level = "MODERATE"

        else:

            level = "LOW"

        return {

            "level":
                level,

            "score":
                score,

            "maximum_score":
                8,

            "reasons":
                reasons,

            "interpretation":
                (
                    "Confidence reflects the amount and "
                    "consistency of available evidence. "
                    "It does not confirm the cause of "
                    "vegetation stress."
                )
        }

    # -----------------------------------------------------
    # COMPLETE EVIDENCE REPORT
    # -----------------------------------------------------

    def generate(self) -> Dict[str, Any]:
        """
        Generate complete evidence information.
        """

        return {

            "evidence":
                self.build_evidence(),

            "confidence":
                self.calculate_confidence()
      }
