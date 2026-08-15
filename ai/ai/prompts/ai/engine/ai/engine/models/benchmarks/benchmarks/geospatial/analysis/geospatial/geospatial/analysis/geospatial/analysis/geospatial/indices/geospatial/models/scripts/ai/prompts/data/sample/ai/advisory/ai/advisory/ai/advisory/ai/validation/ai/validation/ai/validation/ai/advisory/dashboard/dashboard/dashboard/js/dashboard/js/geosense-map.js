"use strict";


let geoSenseMap;


function initializeGeoSenseMap() {

    const mapElement =
        document.getElementById(
            "geosenseMap"
        );


    if (!mapElement) {

        console.error(
            "GeoSense map container not found."
        );

        return;

    }


    mapElement.innerHTML = "";


    geoSenseMap =
        document.createElement("div");


    geoSenseMap.className =
        "geosense-field";


    mapElement.appendChild(
        geoSenseMap
    );


    renderStressZones();

}


function renderStressZones() {

    geoSenseMap.innerHTML = "";


    stressZones.forEach(
        zone => {

            const zoneElement =
                document.createElement(
                    "button"
                );


            zoneElement.className =
                `stress-zone ${getSeverityClass(
                    zone.severity
                )}`;


            zoneElement.style.gridRow =
                zone.row;


            zoneElement.style.gridColumn =
                zone.column;


            zoneElement.innerHTML = `

                <span class="zone-pulse"></span>

                <span class="zone-label">

                    ${zone.name}

                </span>

            `;


            zoneElement.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openZonePanel(
                        zone
                    );

                }
            );


            geoSenseMap.appendChild(
                zoneElement
            );

        }
    );

}


function getSeverityClass(
    severity
) {

    switch (severity) {

        case "HIGH":
            return "severity-high";

        case "MODERATE":
            return "severity-moderate";

        default:
            return "severity-low";

    }

}


function openZonePanel(
    zone
) {

    const existing =
        document.getElementById(
            "zoneInsightPanel"
        );


    if (existing) {

        existing.remove();

    }


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "zoneInsightPanel";


    panel.className =
        "zone-insight-panel";


    panel.innerHTML = `

        <button
            class="close-zone-panel"
            aria-label="Close">

            ×

        </button>


        <span class="eyebrow">

            GEOSENSE INTELLIGENCE

        </span>


        <h2>

            ${zone.name}

        </h2>


        <div class="zone-risk">

            <span>

                ${zone.severity} RISK

            </span>

        </div>


        <div class="zone-metrics">

            <div>

                <small>NDVI</small>

                <strong>

                    ${zone.ndvi.toFixed(2)}

                </strong>

            </div>


            <div>

                <small>STRESS</small>

                <strong>

                    ${zone.stress}%

                </strong>

            </div>

        </div>


        <p>

            ${zone.recommendation}

        </p>


        <button
            class="create-zone-task"
            id="createZoneTask">

            Create Field Task

        </button>

    `;


    document.body.appendChild(
        panel
    );


    panel
        .querySelector(
            ".close-zone-panel"
        )
        .addEventListener(
            "click",
            () => panel.remove()
        );


    panel
        .querySelector(
            "#createZoneTask"
        )
        .addEventListener(
            "click",
            () => {

                createTaskFromZone(
                    zone
                );

            }
        );

}


async function createTaskFromZone(
    zone
) {

    try {

        const response =
            await fetch(
                "/api/field-tasks",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            farmId:
                                "LGS-DEMO-001",

                            zone: {

                                id:
                                    zone.id,

                                name:
                                    zone.name,

                                row:
                                    zone.row,

                                column:
                                    zone.column

                            },

                            ndvi:
                                zone.ndvi,

                            severity:
                                zone.severity,

                            recommendation:
                                zone.recommendation

                        })

                }
            );


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Unable to create task."
            );

        }


        alert(
            `Field task ${result.task.id} created.`
        );


        if (
            typeof loadMissionControl ===
            "function"
        ) {

            loadMissionControl();

        }

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to create field task."
        );

    }

}

function highlightAffectedZones() {

    const zones =
        document.querySelectorAll(
            ".stress-zone"
        );


    zones.forEach(
        zone => {

            zone.classList.add(
                "zone-highlight"
            );

        }
    );


    const highRisk =
        document.querySelectorAll(
            ".severity-high"
        );


    highRisk.forEach(
        zone => {

            zone.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }
    );


    setTimeout(
        () => {

            zones.forEach(
                zone => {

                    zone.classList.remove(
                        "zone-highlight"
                    );

                }
            );

        },
        4000
    );

}


window.highlightAffectedZones =
    highlightAffectedZones;


window.initializeGeoSenseMap =
    initializeGeoSenseMap;
