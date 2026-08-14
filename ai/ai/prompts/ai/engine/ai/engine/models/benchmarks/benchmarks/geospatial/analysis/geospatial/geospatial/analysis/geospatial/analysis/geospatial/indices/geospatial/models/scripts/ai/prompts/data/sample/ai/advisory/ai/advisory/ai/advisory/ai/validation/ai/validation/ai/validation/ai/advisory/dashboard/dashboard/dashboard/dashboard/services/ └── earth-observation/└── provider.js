/**
 * =========================================================
 * LIVA GEOSENSE
 * EARTH OBSERVATION PROVIDER INTERFACE
 * =========================================================
 *
 * This module defines the interface between GeoSense
 * and external Earth-observation providers.
 *
 * The frontend must NOT contain provider credentials.
 */

"use strict";


const GeoSenseEarthObservation = {

    provider:
        "Sentinel-2",

    mission:
        "Copernicus Sentinel-2",


    /**
     * Build a standard observation request.
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


        if (!boundingBox) {

            throw new Error(
                "Bounding box is required."
            );

        }


        if (!startDate || !endDate) {

            throw new Error(
                "Observation date range is required."
            );

        }


        return {

            provider:
                this.provider,

            mission:
                this.mission,

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

                cloudCover:
                    maximumCloudPercentage

            },

            bands: {

                red:
                    "B04",

                nir:
                    "B08"

            },

            output: {

                index:
                    "NDVI",

                resolutionMetres:
                    10

            }

        };

    },


    /**
     * Normalise a provider response into the
     * GeoSense standard observation format.
     */

    normaliseScene(scene) {

        if (!scene) {

            return null;

        }


        return {

            id:
                scene.id || null,

            provider:
                this.provider,

            acquisitionDate:
                scene.acquisitionDate || null,

            cloudCoverPercentage:
                Number(
                    scene.cloudCoverPercentage
                ),

            resolutionMetres:
                10,

            bands: {

                red:
                    scene.bands?.red ?? null,

                nir:
                    scene.bands?.nir ?? null

            },

            sourceType:
                "SATELLITE",

            verified:
                true

        };

    }

};


if (
    typeof window !== "undefined"
) {

    window.GeoSenseEarthObservation =
        GeoSenseEarthObservation;

}
