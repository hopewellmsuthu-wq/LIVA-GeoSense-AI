/**
 * =========================================================
 * LIVA GEOSENSE
 * SENTINEL-2 NDVI EVALSCRIPT
 * =========================================================
 */

"use strict";


const NDVI_EVALSCRIPT = `
//VERSION=3

function setup() {

    return {

        input: [

            {
                bands: [
                    "B04",
                    "B08",
                    "SCL"
                ]
            }

        ],

        output: {

            bands: 1,

            sampleType:
                "FLOAT32"

        }

    };

}


function evaluatePixel(sample) {

    /*
     * Exclude obvious invalid/cloud/shadow classes.
     *
     * SCL:
     * 3  = cloud shadow
     * 8  = cloud medium probability
     * 9  = cloud high probability
     * 10 = thin cirrus
     * 11 = snow/ice
     */

    if (
        sample.SCL === 3 ||
        sample.SCL === 8 ||
        sample.SCL === 9 ||
        sample.SCL === 10 ||
        sample.SCL === 11
    ) {

        return [NaN];

    }


    const denominator =
        sample.B08 +
        sample.B04;


    if (
        denominator === 0
    ) {

        return [NaN];

    }


    const ndvi =
        (
            sample.B08 -
            sample.B04
        ) /
        denominator;


    return [ndvi];

}
`;


module.exports =
    NDVI_EVALSCRIPT;
