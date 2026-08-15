"use strict";


function generateAlert({
    farmId,
    trend,
    stressPercentage,
    meanNDVI
}) {

    let severity = "LOW";
    let title = "Vegetation conditions stable";
    let message = "No significant vegetation deterioration detected.";
    let recommendation = "Continue routine monitoring.";


    if (
        trend === "DECLINING" &&
        (
            stressPercentage >= 30 ||
            meanNDVI < 0.30
        )
    ) {

        severity = "HIGH";

        title =
            "Severe vegetation stress detected";

        message =
            "Vegetation health is declining and significant stress has been detected within the monitored area.";

        recommendation =
            "Inspect affected field zones immediately, focusing on soil moisture, irrigation, pests and disease.";

    }

    else if (
        trend === "DECLINING" &&
        (
            stressPercentage >= 15 ||
            meanNDVI < 0.45
        )
    ) {

        severity = "MODERATE";

        title =
            "Vegetation decline detected";

        message =
            "GeoSense detected a declining vegetation trend.";

        recommendation =
            "Inspect weaker zones and monitor the next satellite observation.";

    }


    return {

        id:
            `ALERT-${Date.now()}`,

        farmId,

        severity,

        title,

        message,

        recommendation,

        meanNDVI,

        stressPercentage,

        trend,

        status:
            severity === "LOW"
                ? "RESOLVED"
                : "ACTIVE",

        createdAt:
            new Date().toISOString()

    };

}


module.exports = {
    generateAlert
};
