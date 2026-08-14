/**
 * =========================================================
 * LIVA GEOSENSE
 * ADVISORY ENGINE
 * =========================================================
 *
 * Converts observed environmental signals into
 * explainable decision-support recommendations.
 *
 * IMPORTANT:
 * GeoSense recommendations are NOT a replacement
 * for professional agricultural assessment.
 */

"use strict";


const GeoSenseAdvisoryEngine = {

    /**
     * Generate recommendations from risk assessment.
     */

    generate(riskAssessment, context = {}) {

        if (!riskAssessment) {

            return {

                title:
                    "Insufficient data",

                summary:
                    "GeoSense does not have enough information to generate an advisory.",

                priority:
                    "LOW",

                actions: []

            };

        }


        const actions = [];


        /*
         * Vegetation decline
         */

        if (
            riskAssessment.factors
                .vegetationTrend >= 10
        ) {

            actions.push({

                priority:
                    "HIGH",

                action:
                    "Inspect the affected field areas for visible crop stress.",

                reason:
                    "Satellite observations indicate a declining vegetation trend."

            });

        }


        /*
         * Low current NDVI
         */

        if (
            riskAssessment.factors
                .currentNDVI >= 18
        ) {

            actions.push({

                priority:
                    "HIGH",

                action:
                    "Prioritise field inspection in areas showing low vegetation activity.",

                reason:
                    "Current vegetation signal is below the healthy monitoring range."

            });

        }


        /*
         * Rainfall
         */

        if (
            riskAssessment.factors
                .rainfall >= 12
        ) {

            actions.push({

                priority:
                    "MEDIUM",

                action:
                    "Review recent rainfall and local water availability.",

                reason:
                    "Recent rainfall conditions may be contributing to vegetation stress."

            });

        }


        /*
         * Soil moisture
         */

        if (
            riskAssessment.factors
                .soilMoisture >= 12
        ) {

            actions.push({

                priority:
                    "HIGH",

                action:
                    "Verify soil moisture conditions in the affected field zones.",

                reason:
                    "The available soil-moisture signal indicates potential water stress."

            });

        }


        /*
         * Spatial stress
         */

        if (
            riskAssessment.factors
                .spatialStress >= 8
        ) {

            actions.push({

                priority:
                    "MEDIUM",

                action:
                    "Inspect the mapped stress zones and compare them with field conditions.",

                reason:
                    "Localized vegetation anomalies were detected spatially."

            });

        }


        /*
         * No actions generated.
         */

        if (
            actions.length === 0
        ) {

            actions.push({

                priority:
                    "LOW",

                action:
                    "Continue monitoring the farm through the next observation period.",

                reason:
                    "No major negative signal was detected."

            });

        }


        /*
         * Determine overall priority.
         */

        let priority =
            "LOW";


        if (
            riskAssessment.level ===
            "CRITICAL"
        ) {

            priority =
                "URGENT";

        }

        else if (
            riskAssessment.level ===
            "HIGH"
        ) {

            priority =
                "HIGH";

        }

        else if (
            riskAssessment.level ===
            "MODERATE"
        ) {

            priority =
                "MEDIUM";

        }


        /*
         * Build summary.
         */

        let summary =
            "GeoSense detected environmental signals that should be monitored.";


        if (
            riskAssessment.level ===
            "CRITICAL"
        ) {

            summary =
                "Multiple significant signals require urgent field verification.";

        }

        else if (
            riskAssessment.level ===
            "HIGH"
        ) {

            summary =
                "Several indicators suggest elevated agricultural stress.";

        }

        else if (
            riskAssessment.level ===
            "MODERATE"
        ) {

            summary =
                "Some indicators suggest emerging agricultural stress.";

        }

        else {

            summary =
                "Current indicators do not show significant agricultural stress.";

        }


        return {

            title:
                "GeoSense Field Advisory",

            summary,

            priority,

            farmId:
                context.farmId || null,

            generatedAt:
                new Date().toISOString(),

            actions

        };

    }

};


/*
 * Expose globally.
 */

if (
    typeof window !== "undefined"
) {

    window.GeoSenseAdvisoryEngine =
        GeoSenseAdvisoryEngine;

              }
