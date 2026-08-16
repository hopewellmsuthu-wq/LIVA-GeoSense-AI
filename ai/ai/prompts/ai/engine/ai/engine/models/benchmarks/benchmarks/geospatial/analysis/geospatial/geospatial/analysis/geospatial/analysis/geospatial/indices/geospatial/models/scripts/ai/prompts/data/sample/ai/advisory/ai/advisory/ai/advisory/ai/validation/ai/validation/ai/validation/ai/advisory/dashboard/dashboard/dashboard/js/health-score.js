"use strict";


const healthData = {

    ndvi: 0.46,

    stressPercentage: 22,

    trendChange: -9.8,

    riskLevel: "MODERATE"

};


function calculateFieldHealthScore() {

    const vegetationScore =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    healthData.ndvi * 100
                )
            )
        );


    const stressScore =
        Math.round(
            Math.max(
                0,
                100 -
                healthData.stressPercentage
            )
        );


    const trendScore =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    100 +
                    healthData.trendChange * 4
                )
            )
        );


    let riskScore = 80;


    if (
        healthData.riskLevel ===
        "HIGH"
    ) {

        riskScore = 30;

    }

    else if (
        healthData.riskLevel ===
        "MODERATE"
    ) {

        riskScore = 55;

    }

    else if (
        healthData.riskLevel ===
        "LOW"
    ) {

        riskScore = 80;

    }


    const overallScore =
        Math.round(

            vegetationScore * 0.35 +

            stressScore * 0.25 +

            trendScore * 0.25 +

            riskScore * 0.15

        );


    return {

        overallScore,

        vegetationScore,

        stressScore,

        trendScore,

        riskScore

    };

}


function getHealthStatus(
    score
) {

    if (score >= 80) {

        return {

            label: "HEALTHY",

            message:
                "Vegetation conditions are strong and current risk is low."

        };

    }


    if (score >= 60) {

        return {

            label: "MODERATE",

            message:
                "Vegetation health requires continued monitoring."

        };

    }


    if (score >= 40) {

        return {

            label: "AT RISK",

            message:
                "Vegetation deterioration requires field attention."

        };

    }


    return {

        label: "CRITICAL",

        message:
            "Significant vegetation stress requires immediate intervention."

    };

}


function renderHealthScore() {

    const score =
        calculateFieldHealthScore();


    const status =
        getHealthStatus(
            score.overallScore
        );


    setText(
        "fieldHealthScore",
        score.overallScore
    );


    setText(
        "fieldHealthStatus",
        status.label
    );


    setText(
        "fieldHealthMessage",
        status.message
    );


    setMetric(
        "vegetationScore",
        "vegetationBar",
        score.vegetationScore
    );


    setMetric(
        "stressScore",
        "stressBar",
        score.stressScore
    );


    setMetric(
        "trendScore",
        "trendBar",
        score.trendScore
    );


    setMetric(
        "riskScore",
        "riskBar",
        score.riskScore
    );

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function setMetric(
    textId,
    barId,
    value
) {

    setText(
        textId,
        value
    );


    const bar =
        document.getElementById(
            barId
        );


    if (bar) {

        bar.style.width =
            `${value}%`;

    }

}


window.renderHealthScore =
    renderHealthScore;
