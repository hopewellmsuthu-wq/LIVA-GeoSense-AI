/**
 * =========================================================
 * LIVA GEOSENSE
 * Satellite Acquisition Service
 * =========================================================
 *
 * RESPONSIBILITY:
 *
 * 1. Define a farm area of interest.
 * 2. Validate satellite observations.
 * 3. Filter observations by cloud cover.
 * 4. Select the most useful observation.
 *
 * IMPORTANT:
 *
 * This MVP does NOT expose satellite credentials.
 * Real provider authentication belongs on a backend.
 */

"use strict";


const GeoSenseSatelliteAcquisition = {

    /**
     * Create a geographic bounding box.
     */

    createBoundingBox(
        south,
        west,
        north,
        east
    ) {

        if (
            !Number.isFinite(south) ||
            !Number.isFinite(west) ||
            !Number.isFinite(north) ||
            !Number.isFinite(east)
        ) {

            throw new TypeError(
                "Bounding-box coordinates must be numbers."
            );

        }


        if (south >= north) {

            throw new Error(
                "South latitude must be smaller than north latitude."
            );

        }


        if (west >= east) {

            throw new Error(
                "West longitude must be smaller than east longitude."
            );

        }


        return {

            south,

            west,

            north,

            east

        };

    },


    /**
     * Validate an observation.
     */

    validateObservation(
        observation
    ) {

        if (!observation) {

            return {

                valid: false,

                reason:
                    "Observation is missing."

            };

        }


        if (
            !observation.acquisitionDate
        ) {

            return {

                valid: false,

                reason:
                    "Acquisition date is missing."

            };

        }


        if (
            !Number.isFinite(
                observation.cloudCoverPercentage
            )
        ) {

            return {

                valid: false,

                reason:
                    "Cloud-cover percentage is missing."

            };

        }


        if (
            observation.cloudCoverPercentage < 0 ||
            observation.cloudCoverPercentage > 100
        ) {

            return {

                valid: false,

                reason:
                    "Cloud-cover percentage must be between 0 and 100."

            };

        }


        return {

            valid: true,

            reason: null

        };

    },


    /**
     * Filter observations by cloud cover.
     */

    filterByCloudCover(
        observations,
        maximumCloudPercentage = 20
    ) {

        if (
            !Array.isArray(observations)
        ) {

            throw new TypeError(
                "Observations must be an array."
            );

        }


        return observations.filter(
            observation => {

                const validation =
                    this.validateObservation(
                        observation
                    );


                if (!validation.valid) {

                    return false;

                }


                return (
                    observation.cloudCoverPercentage
                    <=
                    maximumCloudPercentage
                );

            }
        );

    },


    /**
     * Select the best observation.
     *
     * Priority:
     *
     * 1. Lowest cloud cover
     * 2. Most recent acquisition date
     */

    selectBestObservation(
        observations
    ) {

        if (
            !Array.isArray(observations) ||
            observations.length === 0
        ) {

            return null;

        }


        const validObservations =
            observations.filter(
                observation =>
                    this.validateObservation(
                        observation
                    ).valid
            );


        if (
            validObservations.length === 0
        ) {

            return null;

        }


        return [...validObservations].sort(
            (a, b) => {

                if (
                    a.cloudCoverPercentage !==
                    b.cloudCoverPercentage
                ) {

                    return (
                        a.cloudCoverPercentage -
                        b.cloudCoverPercentage
                    );

                }


                return (
                    new Date(b.acquisitionDate) -
                    new Date(a.acquisitionDate)
                );

            }
        )[0];

    },


    /**
     * Create a standard GeoSense request.
     */

    createRequest({
        farmId,
        boundingBox,
        startDate,
        endDate,
        maximumCloudPercentage = 20
    }) {

        if (!farmId) {

            throw new Error(
                "farmId is required."
            );

        }


        return {

            farmId,

            areaOfInterest:
                boundingBox,

            dateRange: {

                start:
                    startDate,

                end:
                    endDate

            },

            filters: {

                maximumCloudPercentage

            },

            provider:
                "Sentinel-2",

            processing: {

                requiredBands: [

                    "B04",
                    "B08"

                ],

                calculate:

                    "NDVI"

            }

        };

    }

};


/**
 * Make the service available to the browser.
 */

if (
    typeof window !== "undefined"
) {

    window.GeoSenseSatelliteAcquisition =
        GeoSenseSatelliteAcquisition;

}
