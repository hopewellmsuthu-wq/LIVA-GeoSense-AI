/**
 * =========================================================
 * LIVA GEOSENSE
 * SENTINEL-2 SCENE SEARCH SERVICE
 * =========================================================
 *
 * Provider-independent scene search layer.
 *
 * The actual provider request will be connected through
 * the backend. Never expose provider credentials to the
 * browser.
 */

"use strict";


function validateBoundingBox(boundingBox) {

    if (!boundingBox) {

        throw new Error(
            "Bounding box is required."
        );

    }


    const required = [
        "south",
        "west",
        "north",
        "east"
    ];


    for (const field of required) {

        if (
            typeof boundingBox[field] !==
            "number"
        ) {

            throw new Error(
                `Bounding box field '${field}' must be numeric.`
            );

        }

    }


    if (
        boundingBox.south >=
        boundingBox.north
    ) {

        throw new Error(
            "South must be less than north."
        );

    }


    if (
        boundingBox.west >=
        boundingBox.east
    ) {

        throw new Error(
            "West must be less than east."
        );

    }

}


function validateDateRange(
    startDate,
    endDate
) {

    if (!startDate || !endDate) {

        throw new Error(
            "Start and end dates are required."
        );

    }


    const start =
        new Date(startDate);

    const end =
        new Date(endDate);


    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {

        throw new Error(
            "Invalid observation date."
        );

    }


    if (start > end) {

        throw new Error(
            "Start date cannot be after end date."
        );

    }

}


function buildSceneSearchRequest({

    boundingBox,

    startDate,

    endDate,

    maximumCloudPercentage = 20

}) {

    validateBoundingBox(
        boundingBox
    );


    validateDateRange(
        startDate,
        endDate
    );


    return {

        collection:
            "sentinel-2",

        boundingBox,

        startDate,

        endDate,

        cloudCover: {

            maximum:
                maximumCloudPercentage

        },

        requiredBands: [

            "B04",
            "B08"

        ]

    };

}


function normaliseScene(scene) {

    return {

        id:
            scene.id ?? null,

        acquisitionDate:
            scene.acquisitionDate ?? null,

        cloudCoverPercentage:
            Number(
                scene.cloudCoverPercentage ?? 0
            ),

        platform:
            scene.platform ??
            "Sentinel-2",

        processingLevel:
            scene.processingLevel ??
            null,

        geometry:
            scene.geometry ??
            null

    };

}


module.exports = {

    buildSceneSearchRequest,

    normaliseScene

};
