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

function updateNDVIDashboard(value) {

    const result =
        GeoSenseNDVI.classify(
            value
        );


    const formatted =
        GeoSenseNDVI.format(
            value
        );


    const valueElement =
        document.getElementById(
            "ndviValue"
        );


    const labelElement =
        document.getElementById(
            "ndviLabel"
        );


    const messageElement =
        document.getElementById(
            "ndviMessage"
        );


    const statusElement =
        document.getElementById(
            "ndviStatus"
        );


    const indicator =
        document.getElementById(
            "ndviIndicator"
        );


    if (!valueElement) {
        return;
    }


    valueElement.textContent =
        formatted;


    labelElement.textContent =
        result.label;


    statusElement.textContent =
        result.status;


    messageElement.textContent =

        result.status === "LOW"
            ? "Vegetation appears stressed. Investigate the affected area."

        : result.status === "MODERATE"
            ? "Vegetation is developing but should be monitored."

        : result.status === "GOOD"
            ? "Vegetation condition is generally healthy."

        : result.status === "EXCELLENT"
            ? "Strong vegetation signal detected."

        : "No usable satellite data available.";


    if (
        Number.isFinite(value)
    ) {

        const percentage =
            (
                (value + 1) /
                2
            ) *
            100;


        indicator.style.left =
            `${Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            )}%`;

    }

}


window.updateNDVIDashboard =
    updateNDVIDashboard;
