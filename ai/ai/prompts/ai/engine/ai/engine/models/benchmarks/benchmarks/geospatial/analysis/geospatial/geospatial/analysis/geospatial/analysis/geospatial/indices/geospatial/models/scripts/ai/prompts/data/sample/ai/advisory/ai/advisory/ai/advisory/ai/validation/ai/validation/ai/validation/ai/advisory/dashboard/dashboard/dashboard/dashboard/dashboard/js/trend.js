"use strict";


function updateTrendDashboard(
    analysis
) {

    const direction =
        document.getElementById(
            "trendDirection"
        );


    const current =
        document.getElementById(
            "trendCurrent"
        );


    const change =
        document.getElementById(
            "trendChange"
        );


    const status =
        document.getElementById(
            "trendStatus"
        );


    const message =
        document.getElementById(
            "trendMessage"
        );


    if (!analysis) {
        return;
    }


    if (direction) {

        direction.textContent =
            analysis.direction;

    }


    if (current) {

        current.textContent =
            Number(
                analysis.currentNDVI
            ).toFixed(2);

    }


    if (change) {

        const value =
            analysis.change;


        change.textContent =
            value >= 0
                ? `+${value.toFixed(2)}`
                : value.toFixed(2);

    }


    if (status) {

        status.textContent =
            analysis.status;

    }


    if (message) {

        message.textContent =
            analysis.message;

    }

}


window.updateTrendDashboard =
    updateTrendDashboard;
