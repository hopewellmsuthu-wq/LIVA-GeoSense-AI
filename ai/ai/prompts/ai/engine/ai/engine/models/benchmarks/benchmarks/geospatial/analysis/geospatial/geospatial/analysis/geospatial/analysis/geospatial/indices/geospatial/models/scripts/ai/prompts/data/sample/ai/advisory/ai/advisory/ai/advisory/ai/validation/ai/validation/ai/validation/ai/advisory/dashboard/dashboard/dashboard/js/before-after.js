"use strict";


const comparisonData = {

    before: {

        date:
            "20 Jul 2026",

        ndvi:
            0.71

    },


    after: {

        date:
            "14 Aug 2026",

        ndvi:
            0.46

    }

};


function loadBeforeAfterAnalysis() {

    const before =
        comparisonData.before.ndvi;


    const after =
        comparisonData.after.ndvi;


    const change =
        (
            (after - before)
            / before
        ) * 100;


    const insight =
        document.getElementById(
            "comparisonInsight"
        );


    if (!insight) {

        return;

    }


    if (change <= -10) {

        insight.innerHTML = `

            <strong>
                ⚠️ Significant vegetation deterioration
            </strong>

            <p>
                GeoSense detected a
                <strong>${Math.abs(
                    change
                ).toFixed(1)}%</strong>
                decline in mean NDVI between
                ${comparisonData.before.date}
                and
                ${comparisonData.after.date}.
                The affected zones should be inspected.
            </p>

        `;

        return;

    }


    if (change < 0) {

        insight.innerHTML = `

            <strong>
                ⚠️ Vegetation decline detected
            </strong>

            <p>
                Mean NDVI decreased by
                <strong>${Math.abs(
                    change
                ).toFixed(1)}%</strong>.
                GeoSense recommends continued monitoring.
            </p>

        `;

        return;

    }


    insight.innerHTML = `

        <strong>
            🌱 Vegetation condition improving
        </strong>

        <p>
            Mean NDVI increased by
            <strong>${change.toFixed(1)}%</strong>
            between observations.
        </p>

    `;

}


window.loadBeforeAfterAnalysis =
    loadBeforeAfterAnalysis;
