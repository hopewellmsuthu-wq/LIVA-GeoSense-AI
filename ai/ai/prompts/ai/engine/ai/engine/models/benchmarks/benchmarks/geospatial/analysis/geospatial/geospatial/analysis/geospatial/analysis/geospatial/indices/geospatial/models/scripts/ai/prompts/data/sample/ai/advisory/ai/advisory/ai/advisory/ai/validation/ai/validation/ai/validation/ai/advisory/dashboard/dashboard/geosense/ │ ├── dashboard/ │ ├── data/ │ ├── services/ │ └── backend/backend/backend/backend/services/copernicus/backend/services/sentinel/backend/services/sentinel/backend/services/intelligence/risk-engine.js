"use strict";


function generateRisk({
    meanNDVI,
    stressPercentage
}) {

    let level;
    let score;
    let message;


    if (
        meanNDVI === null
    ) {

        return {

            level: "UNKNOWN",

            score: 0,

            message:
                "Insufficient satellite data for risk assessment."

        };

    }


    if (
        stressPercentage >= 30 ||
        meanNDVI < 0.25
    ) {

        level = "HIGH";

        score = 80;

        message =
            "Significant vegetation stress detected. Field investigation is recommended.";

    }

    else if (
        stressPercentage >= 15 ||
        meanNDVI < 0.40
    ) {

        level = "MODERATE";

        score = 50;

        message =
            "Vegetation stress is present in parts of the monitored area.";

    }

    else {

        level = "LOW";

        score = 20;

        message =
            "Current satellite indicators show relatively healthy vegetation.";

    }


    return {

        level,

        score,

        message

    };

}


module.exports = {
    generateRisk
};
