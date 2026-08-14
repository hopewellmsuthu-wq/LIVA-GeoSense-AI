"use strict";


function calculateChange(previous, current) {

    if (
        !Number.isFinite(previous) ||
        !Number.isFinite(current)
    ) {

        return {
            change: null,
            percentageChange: null
        };

    }


    const change =
        current - previous;


    const percentageChange =
        previous !== 0
            ? (
                change /
                Math.abs(previous)
            ) * 100
            : null;


    return {

        change:
            Number(
                change.toFixed(4)
            ),

        percentageChange:
            percentageChange === null
                ? null
                : Number(
                    percentageChange.toFixed(2)
                )

    };

}


function analyseTrend(history) {

    if (
        !Array.isArray(history) ||
        history.length < 2
    ) {

        return {

            status:
                "INSUFFICIENT_DATA",

            direction:
                "UNKNOWN",

            message:
                "At least two observations are required."

        };

    }


    const sorted =
        [...history].sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );


    const previous =
        Number(
            sorted[
                sorted.length - 2
            ].ndvi
        );


    const current =
        Number(
            sorted[
                sorted.length - 1
            ].ndvi
        );


    const result =
        calculateChange(
            previous,
            current
        );


    let direction;
    let status;
    let message;


    if (
        result.change <= -0.15
    ) {

        direction =
            "DECLINING";

        status =
            "HIGH";

        message =
            "Vegetation has declined significantly between observations.";

    }

    else if (
        result.change <= -0.05
    ) {

        direction =
            "DECLINING";

        status =
            "MODERATE";

        message =
            "Vegetation is showing a declining trend.";

    }

    else if (
        result.change >= 0.05
    ) {

        direction =
            "IMPROVING";

        status =
            "POSITIVE";

        message =
            "Vegetation is showing an improving trend.";

    }

    else {

        direction =
            "STABLE";

        status =
            "LOW";

        message =
            "Vegetation is relatively stable.";

    }


    return {

        direction,

        status,

        message,

        previousNDVI:
            previous,

        currentNDVI:
            current,

        change:
            result.change,

        percentageChange:
            result.percentageChange

    };

}


module.exports = {

    calculateChange,

    analyseTrend

};

function calculateTrend(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length < 2
    ) {

        return null;

    }


    const sorted =
        [...history].sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );


    const previous =
        Number(
            sorted[
                sorted.length - 2
            ].ndvi
        );


    const current =
        Number(
            sorted[
                sorted.length - 1
            ].ndvi
        );


    const difference =
        current - previous;


    let direction =
        "STABLE";


    if (
        difference <= -0.05
    ) {

        direction =
            "DECLINING";

    }

    else if (
        difference >= 0.05
    ) {

        direction =
            "IMPROVING";

    }


    return {

        direction,

        currentNDVI:
            current,

        previousNDVI:
            previous,

        change:
            difference,

        status:
            difference <= -0.15
                ? "HIGH"

                : difference <= -0.05
                    ? "MODERATE"

                    : difference >= 0.05
                        ? "POSITIVE"

                        : "LOW",

        message:

            difference <= -0.15

                ? "Rapid vegetation decline detected."

                : difference <= -0.05

                    ? "Vegetation is declining and should be investigated."

                    : difference >= 0.05

                        ? "Vegetation is improving."

                        : "Vegetation is relatively stable."

    };

}


window.GeoSenseTrendEngine = {

    calculateTrend

};
