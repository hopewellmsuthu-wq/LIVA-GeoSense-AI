"use strict";


function generateAdvisory({
    riskLevel,
    stressPercentage
}) {

    if (
        riskLevel === "HIGH"
    ) {

        return {

            priority:
                "URGENT",

            action:
                "Inspect stressed field zones as soon as possible.",

            checks: [

                "Check soil moisture.",

                "Inspect irrigation coverage.",

                "Check for pest or disease symptoms.",

                "Assess nutrient availability."

            ]

        };

    }


    if (
        riskLevel === "MODERATE"
    ) {

        return {

            priority:
                "MONITOR",

            action:
                "Monitor identified zones and compare against the next satellite observation.",

            checks: [

                "Review irrigation consistency.",

                "Inspect visibly weaker areas.",

                "Compare vegetation trend over time."

            ]

        };

    }


    return {

        priority:
            "NORMAL",

        action:
            "Continue routine field monitoring.",

        checks: [

            "Maintain normal crop monitoring.",

            "Review the next satellite observation."

        ]

    };

}


module.exports = {
    generateAdvisory
};
