/**
 * =========================================================
 * LIVA GEOSENSE
 * REAL SENTINEL-2 STAC SCENE SEARCH
 * =========================================================
 */

"use strict";


const STAC_URL =
    "https://stac.dataspace.copernicus.eu/v1/search";


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
            typeof boundingBox[field] !== "number"
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


function createPolygon(boundingBox) {

    const {
        south,
        west,
        north,
        east
    } = boundingBox;


    return {

        type: "Polygon",

        coordinates: [[

            [west, south],

            [east, south],

            [east, north],

            [west, north],

            [west, south]

        ]]

    };

}


async function searchSentinelScenes({

    boundingBox,

    startDate,

    endDate,

    maximumCloudPercentage = 20,

    limit = 10

}) {

    validateBoundingBox(
        boundingBox
    );


    validateDateRange(
        startDate,
        endDate
    );


    const geometry =
        createPolygon(
            boundingBox
        );


    const start =
        `${startDate}T00:00:00Z`;


    const end =
        `${endDate}T23:59:59Z`;


    const payload = {

        collections: [
            "sentinel-2-l2a"
        ],

        datetime:
            `${start}/${end}`,

        intersects:
            geometry,

        query: {

            "eo:cloud_cover": {

                lte:
                    maximumCloudPercentage

            }

        },

        sortby: [

            {

                field:
                    "properties.eo:cloud_cover",

                direction:
                    "asc"

            }

        ],

        limit

    };


    const response =
        await fetch(
            STAC_URL,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    if (!response.ok) {

        const message =
            await response.text();


        throw new Error(
            `Sentinel STAC request failed (${response.status}): ${message}`
        );

    }


    const data =
        await response.json();


    return data.features || [];

}


function normaliseScene(scene) {

    const properties =
        scene.properties || {};


    return {

        id:
            scene.id || null,

        collection:
            "sentinel-2-l2a",

        provider:
            "Copernicus Data Space",

        platform:
            properties.platform ||
            "Sentinel-2",

        acquisitionDate:
            properties.datetime ||
            properties["dct:created"] ||
            null,

        cloudCoverPercentage:
            Number(
                properties["eo:cloud_cover"] ??
                0
            ),

        geometry:
            scene.geometry ||
            null,

        assets:
            scene.assets ||
            {},

        source:
            "REAL_STAC_CATALOGUE"

    };

}


module.exports = {

    searchSentinelScenes,

    normaliseScene

};
