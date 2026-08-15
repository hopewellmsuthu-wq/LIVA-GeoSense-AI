"use strict";


const {
    generateRisk
} = require(
    "./risk-engine"
);


const {
    generateAdvisory
} = require(
    "./advisory-engine"
);


const {
    generateAlert
} = require(
    "../alerts/alert-engine"
);


const {
    addAlert
} = require(
    "../alerts/alert-store"
);


function runGeoSenseIntelligence({

    farmId,

    meanNDVI,

    stressPercentage,

    trend

}) {

    const risk =
        generateRisk({

            meanNDVI,

            stressPercentage

        });


    const advisory =
        generateAdvisory({

            riskLevel:
                risk.level,

            stressPercentage

        });


    const alert =
        generateAlert({

            farmId,

            trend,

            stressPercentage,

            meanNDVI

        });


    if (
        alert.status === "ACTIVE"
    ) {

        addAlert(
            alert
        );

    }


    return {

        risk,

        advisory,

        alert

    };

}


module.exports = {

    runGeoSenseIntelligence

};
