/**
 * =========================================================
 * LIVA GEOSENSE
 * REAL NDVI PROCESSING
 * =========================================================
 */

"use strict";


const {
    getAccessToken
} = require(
    "../copernicus/authentication"
);


const {
    NDVI_EVALSCRIPT
} = require(
    "./ndvi-evalscript"
);


function createBBox(
    boundingBox
) {

    return [

        boundingBox.west,

        boundingBox.south,

        boundingBox.east,

        boundingBox.north

    ];

}


async function processNDVI({

    boundingBox,

    startDate,

    endDate,

    width = 512,

    height = 512

}) {

    const token =
        await getAccessToken();


    const url =
        `${process.env.SENTINEL_HUB_URL}/process/v1`;


    const payload = {

        input: {

            bounds: {

                bbox:
                    createBBox(
                        boundingBox
                    )

            },

            data: [

                {

                    type:
                        "S2L2A",

                    dataFilter: {

                        timeRange: {

                            from:
                                `${startDate}T00:00:00Z`,

                            to:
                                `${endDate}T23:59:59Z`

                        },

                        mosaickingOrder:
                            "leastCC"

                    }

                }

            ]

        },


        output: {

            width,

            height,

            responses: [

                {

                    identifier:
                        "default",

                    format: {

                        type:
                            "image/tiff"

                    }

                }

            ]

        },


        evalscript:
            NDVI_EVALSCRIPT

    };


    const response =
        await fetch(
            url,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

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
            `NDVI processing failed (${response.status}): ${message}`
        );

    }


    const buffer =
        await response.arrayBuffer();


    return {

        buffer,

        contentType:
            response.headers
                .get(
                    "content-type"
                ) ||
            "image/tiff"

    };

}


module.exports = {

    processNDVI

};
