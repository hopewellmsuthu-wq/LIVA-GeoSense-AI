/**
 * =========================================================
 * LIVA GEOSENSE
 * EXPLAINABLE AGRICULTURAL RISK ENGINE
 * =========================================================
 */

"use strict";


const GeoSenseRiskEngine = {

    /**
     * Clamp a value between minimum and maximum.
     */

    clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(max, value)
        );

    },


    /**
     * Score NDVI decline.
     */

    scoreNDVITrend(change) {

        if (change <= -0.20) {

            return {
                score: 30,
                reason:
                    "Severe vegetation decline detected."
            };

        }


        if (change <= -0.10) {

            return {
                score: 20,
                reason:
                    "Significant vegetation decline detected."
            };

        }


        if (change < -0.03) {

            return {
                score: 10,
                reason:
                    "Vegetation is showing a declining trend."
            };

        }


        return {
            score: 0,
            reason:
                "No significant negative vegetation trend detected."
        };

    },


    /**
     * Score current NDVI.
     */

    scoreCurrentNDVI(ndvi) {

        if (ndvi < 0.25) {

            return {
                score: 25,
                reason:
                    "Current vegetation signal is very low."
            };

        }


        if (ndvi < 0.40) {

            return {
                score: 18,
                reason:
                    "Current vegetation signal is below healthy levels."
            };

        }


        if (ndvi < 0.55) {

            return {
                score: 10,
                reason:
                    "Vegetation condition is moderate."
            };

        }


        return {
            score: 0,
            reason:
                "Current vegetation signal is relatively healthy."
        };

    },


    /**
     * Score rainfall conditions.
     *
     * This MVP uses a simplified rainfall signal.
     */

    scoreRainfall(rainfall) {

        if (rainfall < 20) {

            return {
                score: 20,
                reason:
                    "Very low recent rainfall may indicate water stress."
            };

        }


        if (rainfall < 40) {

            return {
                score: 12,
                reason:
                    "Rainfall is below the preferred monitoring threshold."
            };

        }


        if (rainfall < 60) {

            return {
                score: 5,
                reason:
                    "Rainfall conditions are moderate."
            };

        }


        return {
            score: 0,
            reason:
                "Rainfall signal is currently adequate."
        };

    },


    /**
     * Score soil moisture.
     */

    scoreSoilMoisture(moisture) {

        if (moisture < 20) {

            return {
                score: 20,
                reason:
                    "Very low soil moisture indicates potential water stress."
            };

        }


        if (moisture < 30) {

            return {
                score: 12,
                reason:
                    "Soil moisture is below the preferred level."
            };

        }


        if (moisture < 40) {

            return {
                score: 5,
                reason:
                    "Soil moisture is moderate."
            };

        }


        return {
            score: 0,
            reason:
                "Soil moisture is currently adequate."
        };

    },


    /**
     * Score spatial vegetation stress.
     */

    scoreSpatialStress(stressedZones) {

        if (stressedZones >= 3) {

            return {
                score: 15,
                reason:
                    "Multiple stressed vegetation zones detected."
            };

        }


        if (stressedZones >= 1) {

            return {
                score: 8,
                reason:
                    "Localized vegetation stress detected."
            };

        }


        return {
            score: 0,
            reason:
                "No significant localized stress detected."
        };

    },


    /**
     * Convert score to risk level.
     */

    classifyRisk(score) {

        if (score >= 70) {

            return "CRITICAL";

        }


        if (score >= 50) {

            return "HIGH";

        }


        if (score >= 30) {

            return "MODERATE";

        }


        return "LOW";

    },


    /**
     * Generate complete risk assessment.
     */

    assess({

        ndviChange,

        currentNDVI,

        rainfall,

        soilMoisture,

        stressedZones = 0

    }) {

        const trend =
            this.scoreNDVITrend(
                ndviChange
            );


        const vegetation =
            this.scoreCurrentNDVI(
                currentNDVI
            );


        const rain =
            this.scoreRainfall(
                rainfall
            );


        const moisture =
            this.scoreSoilMoisture(
                soilMoisture
            );


        const spatial =
            this.scoreSpatialStress(
                stressedZones
            );


        const rawScore =
            trend.score +
            vegetation.score +
            rain.score +
            moisture.score +
            spatial.score;


        const score =
            this.clamp(
                rawScore,
                0,
                100
            );


        const level =
            this.classifyRisk(
                score
            );


        const evidence = [

            trend.reason,

            vegetation.reason,

            rain.reason,

            moisture.reason,

            spatial.reason

        ];


        return {

            score,

            level,

            evidence,

            factors: {

                vegetationTrend:
                    trend.score,

                currentNDVI:
                    vegetation.score,

                rainfall:
                    rain.score,

                soilMoisture:
                    moisture.score,

                spatialStress:
                    spatial.score

            },

            generatedAt:
                new Date().toISOString()

        };

    }

};


if (
    typeof window !== "undefined"
) {

    window.GeoSenseRiskEngine =
        GeoSenseRiskEngine;

  }
