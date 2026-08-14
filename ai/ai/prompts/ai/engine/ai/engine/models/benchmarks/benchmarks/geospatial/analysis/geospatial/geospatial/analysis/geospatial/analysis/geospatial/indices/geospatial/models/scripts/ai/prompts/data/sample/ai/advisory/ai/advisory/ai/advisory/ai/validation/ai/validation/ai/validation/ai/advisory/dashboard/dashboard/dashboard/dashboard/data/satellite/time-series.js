/**
 * =========================================================
 * LIVA GEOSENSE
 * NDVI TIME-SERIES ENGINE
 * =========================================================
 */

"use strict";


const GeoSenseTimeSeries = {

    /**
     * Sort observations chronologically.
     */

    sortObservations(observations) {

        return [...observations].sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );

    },


    /**
     * Calculate change between the first
     * and latest NDVI observations.
     */

    calculateChange(observations) {

        const sorted =
            this.sortObservations(
                observations
            );


        if (sorted.length < 2) {

            return {

                absolute: 0,

                percentage: 0,

                direction: "STABLE"

            };

        }


        const first =
            sorted[0].ndvi;

        const latest =
            sorted[
                sorted.length - 1
            ].ndvi;


        const absolute =
            Number(
                (latest - first)
                    .toFixed(4)
            );


        const percentage =
            first === 0
                ? 0
                : Number(
                    (
                        (absolute / first) *
                        100
                    ).toFixed(2)
                );


        let direction =
            "STABLE";


        if (absolute < -0.03) {

            direction =
                "DECLINING";

        }

        else if (absolute > 0.03) {

            direction =
                "IMPROVING";

        }


        return {

            absolute,

            percentage,

            direction

        };

    },


    /**
     * Calculate simple average NDVI.
     */

    calculateAverage(observations) {

        if (
            !observations.length
        ) {

            return 0;

        }


        const total =
            observations.reduce(
                (sum, observation) =>
                    sum + observation.ndvi,
                0
            );


        return Number(
            (
                total /
                observations.length
            ).toFixed(4)
        );

    },


    /**
     * Generate a human-readable interpretation.
     */

    generateInterpretation(observations) {

        const change =
            this.calculateChange(
                observations
            );


        const average =
            this.calculateAverage(
                observations
            );


        if (
            change.direction ===
            "DECLINING"
        ) {

            return {

                headline:
                    "Vegetation condition is declining.",

                detail:
                    `NDVI has decreased by ${Math.abs(change.percentage)}% over the observed period.`,

                severity:
                    "WARNING",

                averageNDVI:
                    average

            };

        }


        if (
            change.direction ===
            "IMPROVING"
        ) {

            return {

                headline:
                    "Vegetation condition is improving.",

                detail:
                    `NDVI has increased by ${change.percentage}% over the observed period.`,

                severity:
                    "POSITIVE",

                averageNDVI:
                    average

            };

        }


        return {

            headline:
                "Vegetation condition is relatively stable.",

            detail:
                "No significant NDVI change was detected in the observed period.",

            severity:
                "INFO",

            averageNDVI:
                average

        };

    }

};


if (
    typeof window !== "undefined"
) {

    window.GeoSenseTimeSeries =
        GeoSenseTimeSeries;

      }
