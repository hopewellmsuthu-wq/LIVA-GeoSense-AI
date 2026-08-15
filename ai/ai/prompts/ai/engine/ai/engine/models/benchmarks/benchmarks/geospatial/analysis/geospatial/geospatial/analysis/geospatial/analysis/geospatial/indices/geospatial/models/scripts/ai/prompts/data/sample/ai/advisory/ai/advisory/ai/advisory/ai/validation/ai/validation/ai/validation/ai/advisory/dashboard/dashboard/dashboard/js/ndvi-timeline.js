"use strict";


const demoNDVIHistory = [

    {
        date: "20 Jul",
        ndvi: 0.71
    },

    {
        date: "27 Jul",
        ndvi: 0.67
    },

    {
        date: "03 Aug",
        ndvi: 0.59
    },

    {
        date: "10 Aug",
        ndvi: 0.51
    },

    {
        date: "14 Aug",
        ndvi: 0.46
    }

];


let ndviTimelineChart;


function loadNDVITimeline() {

    renderNDVISummary();

    renderNDVIChart();

}


function renderNDVISummary() {

    const current =
        demoNDVIHistory[
            demoNDVIHistory.length - 1
        ].ndvi;


    const previous =
        demoNDVIHistory[
            demoNDVIHistory.length - 2
        ].ndvi;


    const change =
        (
            (current - previous)
            / previous
        ) * 100;


    const currentElement =
        document.getElementById(
            "timelineCurrentNDVI"
        );


    const previousElement =
        document.getElementById(
            "timelinePreviousNDVI"
        );


    const changeElement =
        document.getElementById(
            "timelineChange"
        );


    const trendElement =
        document.getElementById(
            "timelineTrend"
        );


    if (currentElement) {

        currentElement.textContent =
            current.toFixed(2);

    }


    if (previousElement) {

        previousElement.textContent =
            previous.toFixed(2);

    }


    if (changeElement) {

        changeElement.textContent =
            `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

    }


    if (trendElement) {

        trendElement.textContent =
            change < -2
                ? "DECLINING"
                : change > 2
                    ? "IMPROVING"
                    : "STABLE";

        trendElement.className =
            change < -2
                ? "trend-negative"
                : change > 2
                    ? "trend-positive"
                    : "trend-neutral";

    }


    renderNDVIInsight(
        current,
        change
    );

}


function renderNDVIInsight(
    current,
    change
) {

    const element =
        document.getElementById(
            "ndviInsight"
        );


    if (!element) {

        return;

    }


    if (change <= -5) {

        element.innerHTML = `

            <strong>
                ⚠️ Vegetation deterioration detected
            </strong>

            <p>
                GeoSense detected a significant
                decline in vegetation health.
                Further field inspection is recommended.
            </p>

        `;

        return;

    }


    if (change >= 5) {

        element.innerHTML = `

            <strong>
                🌱 Vegetation recovery detected
            </strong>

            <p>
                Vegetation health is improving
                compared with the previous observation.
            </p>

        `;

        return;

    }


    element.innerHTML = `

        <strong>
            ✓ Vegetation condition is relatively stable
        </strong>

        <p>
            Continue monitoring future satellite observations.
        </p>

    `;

}


function renderNDVIChart() {

    const canvas =
        document.getElementById(
            "ndviTimelineChart"
        );


    if (!canvas) {

        return;

    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js has not been loaded."
        );

        return;

    }


    if (
        ndviTimelineChart
    ) {

        ndviTimelineChart.destroy();

    }


    ndviTimelineChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        demoNDVIHistory.map(
                            item =>
                                item.date
                        ),

                    datasets: [

                        {

                            label:
                                "NDVI",

                            data:
                                demoNDVIHistory.map(
                                    item =>
                                        item.ndvi
                                ),

                            tension:
                                0.35,

                            fill:
                                true,

                            pointRadius:
                                5,

                            pointHoverRadius:
                                8

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        intersect:
                            false,

                        mode:
                            "index"

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    context =>
                                        ` NDVI: ${
                                            Number(
                                                context.parsed.y
                                            ).toFixed(2)
                                        }`

                            }

                        }

                    },


                    scales: {

                        y: {

                            min:
                                0,

                            max:
                                1,

                            ticks: {

                                callback:
                                    value =>
                                        Number(
                                            value
                                        ).toFixed(1)

                            }

                        }

                    }

                }

            }
        );

}


window.loadNDVITimeline =
    loadNDVITimeline;
