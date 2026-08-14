/**
 * =========================================================
 * LIVA GEOSENSE
 * EARTH OBSERVATION API CONTRACT
 * =========================================================
 */

"use strict";


const GeoSenseEOApi = {

    endpoints: {

        scenes:
            "/api/earth-observation/scenes",

        observation:
            "/api/earth-observation/observation",

        ndvi:
            "/api/earth-observation/ndvi"

    },


    /**
     * Standard request payload.
     */

    sceneSearchPayload({

        farmId,

        boundingBox,

        startDate,

        endDate,

        maximumCloudPercentage = 20

    }) {

        return {

            farmId,

            boundingBox,

            startDate,

            endDate,

            maximumCloudPercentage

        };

    }

};


if (
    typeof window !== "undefined"
) {

    window.GeoSenseEOApi =
        GeoSenseEOApi;

}
