"use strict";


const GeoSenseNDVI = {

    classify(value) {

        if (
            value === null ||
            !Number.isFinite(value)
        ) {

            return {
                label: "No data",
                status: "NO_DATA"
            };

        }


        if (value < 0.20) {

            return {
                label: "Low vegetation",
                status: "LOW"
            };

        }


        if (value < 0.40) {

            return {
                label: "Moderate vegetation",
                status: "MODERATE"
            };

        }


        if (value < 0.60) {

            return {
                label: "Good vegetation",
                status: "GOOD"
            };

        }


        return {
            label: "Excellent vegetation",
            status: "EXCELLENT"
        };

    },


    format(value) {

        if (
            value === null ||
            !Number.isFinite(value)
        ) {

            return "--";

        }

        return Number(
            value
        ).toFixed(2);

    }

};


window.GeoSenseNDVI =
    GeoSenseNDVI;
