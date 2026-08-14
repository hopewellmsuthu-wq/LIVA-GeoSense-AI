/**
 * =========================================================
 * LIVA GEOSENSE
 * NDVI Calculation Engine
 * =========================================================
 */

"use strict";


/**
 * Calculate NDVI.
 *
 * Formula:
 *
 * NDVI = (NIR - RED) / (NIR + RED)
 *
 * Expected result:
 *
 * -1 to +1
 */

function calculateNDVI(
    red,
    nir
) {

    if (
        typeof red !== "number" ||
        typeof nir !== "number"
    ) {

        throw new TypeError(
            "Red and NIR values must be numbers."
        );

    }


    const denominator =
        nir + red;


    /*
     * Prevent division by zero.
     */

    if (denominator === 0) {

        return null;

    }


    const ndvi =
        (
            (nir - red) /
            denominator
        );


    /*
     * Keep the result within the theoretical
     * NDVI range.
     */

    const bounded =
        Math.max(
            -1,
            Math.min(
                1,
                ndvi
            )
        );


    return Number(
        bounded.toFixed(4)
    );

}


/**
 * Classify NDVI into a simple vegetation condition.
 */

function classifyNDVI(ndvi) {

    if (
        typeof ndvi !== "number"
    ) {

        return {

            status:
                "UNKNOWN",

            label:
                "No data"

        };

    }


    if (ndvi < 0) {

        return {

            status:
                "NON_VEGETATED",

            label:
                "Water / bare surface"

        };

    }


    if (ndvi < 0.20) {

        return {

            status:
                "VERY_LOW",

            label:
                "Very low vegetation"

        };

    }


    if (ndvi < 0.40) {

        return {

            status:
                "LOW",

            label:
                "Low vegetation"

        };

    }


    if (ndvi < 0.60) {

        return {

            status:
                "MODERATE",

            label:
                "Moderate vegetation"

        };

    }


    if (ndvi < 0.80) {

        return {

            status:
                "HEALTHY",

            label:
                "Healthy vegetation"

        };

    }


    return {

        status:
            "VERY_HEALTHY",

        label:
            "Very healthy vegetation"

    };

}


/**
 * Build a complete NDVI observation.
 */

function createNDVIObservation({

    red,

    nir,

    date,

    latitude,

    longitude

}) {

    const ndvi =
        calculateNDVI(
            red,
            nir
        );


    const classification =
        classifyNDVI(
            ndvi
        );


    return {

        date:
            date || null,

        location: {

            latitude:
                latitude ?? null,

            longitude:
                longitude ?? null

        },

        bands: {

            red,

            nir

        },

        ndvi,

        classification

    };

}


/*
 * Expose functions globally for the MVP.
 */

if (typeof window !== "undefined") {

    window.GeoSenseNDVI = {

        calculateNDVI,

        classifyNDVI,

        createNDVIObservation

    };

}
