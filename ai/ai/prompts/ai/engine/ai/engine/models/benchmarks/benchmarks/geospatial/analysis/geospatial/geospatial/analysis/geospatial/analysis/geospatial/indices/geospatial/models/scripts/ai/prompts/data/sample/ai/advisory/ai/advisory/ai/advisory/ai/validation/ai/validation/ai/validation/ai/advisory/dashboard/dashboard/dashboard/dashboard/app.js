/* =========================================================
   LIVA GEOSENSE
   Dashboard Interaction Engine
   ========================================================= */

"use strict";


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const GeoSenseState = {

    activeSection: "overview",

    farm: {
        id: "LGS-DEMO-001",

        name:
            "LIVA GeoSense Demonstration Farm",

        crop:
            "Maize",

        hectares:
            12.5,

        country:
            "South Africa"
    },

    observations: {

        currentNDVI:
            0.49,

        previousNDVI:
            0.68,

        rainfall:
            42,

        soilMoisture:
            31.5
    },

    risk: {

        score:
            7,

        level:
            "MODERATE"
    },

    lastUpdated:
        new Date()
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function getElement(selector) {

    return document.querySelector(selector);

}


function getElements(selector) {

    return document.querySelectorAll(selector);

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {

    const sections =
        getElements(".dashboard-section");

    const navigationItems =
        getElements(".nav-item");


    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    navigationItems.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    const targetSection =
        document.getElementById(sectionId);


    const targetNav =
        document.querySelector(
            `[data-section="${sectionId}"]`
        );


    if (!targetSection) {

        console.warn(
            `Section not found: ${sectionId}`
        );

        return;
    }


    targetSection.classList.add(
        "active-section"
    );


    if (targetNav) {

        targetNav.classList.add(
            "active"
        );

    }


    GeoSenseState.activeSection =
        sectionId;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   NAVIGATION EVENTS
   ========================================================= */

function initialiseNavigation() {

    const navigationItems =
        getElements(".nav-item");


    navigationItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;

                showSection(section);

            }
        );

    });


    const sectionButtons =
        getElements(
            "[data-section-target]"
        );


    sectionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.sectionTarget;

                showSection(section);

            }
        );

    });

}


/* =========================================================
   NDVI CALCULATION
   ========================================================= */

function calculateNDVIChange() {

    const current =
        GeoSenseState.observations.currentNDVI;

    const previous =
        GeoSenseState.observations.previousNDVI;


    if (
        typeof current !== "number" ||
        typeof previous !== "number"
    ) {

        return 0;

    }


    return Number(
        (current - previous).toFixed(2)
    );

}


/* =========================================================
   VEGETATION TREND
   ========================================================= */

function calculateVegetationTrend() {

    const change =
        calculateNDVIChange();


    if (change <= -0.10) {

        return "Declining";

    }


    if (change >= 0.10) {

        return "Improving";

    }


    return "Stable";

}


/* =========================================================
   RISK CALCULATION
   ========================================================= */

function calculateRisk() {

    const change =
        calculateNDVIChange();


    let score = 0;


    /*
     * NDVI decline
     */

    if (change <= -0.20) {

        score += 4;

    }

    else if (change <= -0.10) {

        score += 3;

    }

    else if (change < 0) {

        score += 1;

    }


    /*
     * Rainfall signal
     */

    if (
        GeoSenseState.observations.rainfall < 30
    ) {

        score += 2;

    }

    else {

        score += 1;

    }


    /*
     * Soil moisture
     */

    if (
        GeoSenseState.observations.soilMoisture < 25
    ) {

        score += 2;

    }

    else {

        score += 1;

    }


    let level = "LOW";


    if (score >= 7) {

        level = "MODERATE";

    }


    if (score >= 9) {

        level = "HIGH";

    }


    GeoSenseState.risk.score =
        score;

    GeoSenseState.risk.level =
        level;


    return {

        score,

        level

    };

}


/* =========================================================
   UPDATE DASHBOARD METRICS
   ========================================================= */

function updateMetrics() {

    const ndviElement =
        getElement("#ndviValue");


    if (ndviElement) {

        ndviElement.textContent =
            GeoSenseState
                .observations
                .currentNDVI
                .toFixed(2);

    }


    const trend =
        calculateVegetationTrend();


    const trendElement =
        document.querySelector(
            ".metrics-grid .metric-card:nth-child(2) strong"
        );


    if (trendElement) {

        trendElement.textContent =
            trend;

        trendElement.className =
            trend === "Declining"
                ? "danger-text"
                : "";

    }


    const risk =
        calculateRisk();


    const riskElement =
        document.querySelector(
            ".metrics-grid .metric-card:nth-child(3) strong"
        );


    if (riskElement) {

        riskElement.textContent =
            capitalise(risk.level);

        riskElement.className =
            risk.level === "HIGH"
                ? "danger-text"
                : "warning-text";

    }

}


/* =========================================================
   CAPITALISE TEXT
   ========================================================= */

function capitalise(value) {

    if (!value) {

        return "";

    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1).toLowerCase()
    );

}


/* =========================================================
   REFRESH SIMULATION
   ========================================================= */

function refreshDashboard() {

    const button =
        getElement("#refreshBtn");


    if (!button) {

        return;

    }


    const originalText =
        button.textContent;


    button.disabled =
        true;

    button.textContent =
        "↻ Updating...";


    /*
     * Simulate data processing.
     *
     * Later this will call the real
     * GeoSense backend.
     */

    setTimeout(() => {

        updateMetrics();

        updateTimestamp();


        button.textContent =
            "✓ Updated";


        setTimeout(() => {

            button.textContent =
                originalText;

            button.disabled =
                false;

        }, 1200);


    }, 700);

}


/* =========================================================
   UPDATE TIMESTAMP
   ========================================================= */

function updateTimestamp() {

    GeoSenseState.lastUpdated =
        new Date();


    const time =
        GeoSenseState
            .lastUpdated
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


    console.log(
        `GeoSense updated at ${time}`
    );

}


/* =========================================================
   MAP INTERACTION
   ========================================================= */

function initialiseMap() {

    const mapElement =
        getElement("#farmMap");


    if (!mapElement) {

        console.warn(
            "GeoSense map container not found."
        );

        return;

    }


    /*
     * Make sure Leaflet loaded correctly.
     */

    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leaflet could not be loaded."
        );

        mapElement.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#8fa2b8;
                font-size:13px;
            ">
                Map library unavailable
            </div>
        `;

        return;

    }


    /*
     * Demonstration coordinates.
     *
     * Later these will come directly from
     * the GeoSense farm dataset.
     */

    const farmCoordinates = [
        -31.5833,
        28.7833
    ];


    /*
     * Create map.
     */

    const map = L.map(
        "farmMap",
        {
            zoomControl: true,
            attributionControl: true
        }
    );


    /*
     * Satellite-style base layer.
     *
     * We are keeping the MVP provider-independent.
     */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    /*
     * Centre map on farm.
     */

    map.setView(
        farmCoordinates,
        15
    );


    /*
     * Farm boundary.
     *
     * This is demonstration geometry.
     * Later it will come from actual GeoJSON.
     */

    const farmBoundary = [

        [
            -31.5819,
            28.7819
        ],

        [
            -31.5812,
            28.7845
        ],

        [
            -31.5837,
            28.7860
        ],

        [
            -31.5850,
            28.7831
        ],

        [
            -31.5842,
            28.7812
        ]

    ];


    /*
     * Draw farm polygon.
     */

    const farmPolygon =
        L.polygon(
            farmBoundary,
            {
                color: "#34d399",

                weight: 2,

                fillColor: "#22c55e",

                fillOpacity: 0.20
            }
        ).addTo(map);


    /*
     * Farm marker.
     */

    const marker =
        L.marker(
            farmCoordinates
        ).addTo(map);


    marker.bindPopup(`
        <div style="
            min-width:180px;
            font-family:Arial,sans-serif;
        ">

            <strong>
                LIVA GeoSense Farm
            </strong>

            <br><br>

            Crop:
            ${GeoSenseState.farm.crop}

            <br>

            Area:
            ${GeoSenseState.farm.hectares}
            ha

            <br>

            NDVI:
            ${GeoSenseState.observations.currentNDVI}

            <br><br>

            <strong>
                Risk:
                ${GeoSenseState.risk.level}
            </strong>

        </div>
    `);


    /*
     * Polygon popup.
     */

    farmPolygon.bindPopup(`
        <strong>
            ${GeoSenseState.farm.name}
        </strong>

        <br><br>

        Farm ID:
        ${GeoSenseState.farm.id}

        <br>

        Area:
        ${GeoSenseState.farm.hectares} ha

        <br>

        Crop:
        ${GeoSenseState.farm.crop}
    `);


    /*
     * Click event.
     */

    farmPolygon.on(
        "click",
        () => {

            console.log(
                "Farm boundary selected."
            );

        }
    );


    /*
     * Save map instance globally.
     *
     * This allows future GeoSense
     * layers to interact with it.
     */

    window.GeoSenseMap =
        map;


    window.GeoSenseFarmPolygon =
        farmPolygon;


    console.log(
        "Interactive GeoSense map ready."
    );

       }
    /*
     * =====================================================
     * NDVI ZONES
     * =====================================================
     *
     * Demonstration remote-sensing zones.
     *
     * Later these polygons can be generated from
     * actual satellite NDVI raster/vector processing.
     */

    const ndviZones = [

        {
            name: "Healthy vegetation",

            ndvi: 0.72,

            status: "HEALTHY",

            color: "#34d399",

            coordinates: [

                [
                    -31.5820,
                    28.7822
                ],

                [
                    -31.5815,
                    28.7840
                ],

                [
                    -31.5830,
                    28.7848
                ],

                [
                    -31.5838,
                    28.7832
                ]

            ]
        },


        {
            name: "Moderate vegetation",

            ndvi: 0.51,

            status: "MODERATE",

            color: "#fbbf24",

            coordinates: [

                [
                    -31.5830,
                    28.7848
                ],

                [
                    -31.5840,
                    28.7853
                ],

                [
                    -31.5847,
                    28.7835
                ],

                [
                    -31.5838,
                    28.7832
                ]

            ]
        },


        {
            name: "Vegetation stress",

            ndvi: 0.31,

            status: "STRESSED",

            color: "#fb7185",

            coordinates: [

                [
                    -31.5840,
                    28.7853
                ],

                [
                    -31.5850,
                    28.7832
                ],

                [
                    -31.5842,
                    28.7818
                ],

                [
                    -31.5838,
                    28.7832
                ]

            ]
        }

    ];


    /*
     * Store generated layers.
     */

    window.GeoSenseNDVILayers = [];


    /*
     * Draw each NDVI zone.
     */

    ndviZones.forEach(
        zone => {

            const polygon =
                L.polygon(
                    zone.coordinates,
                    {
                        color:
                            zone.color,

                        weight:
                            2,

                        fillColor:
                            zone.color,

                        fillOpacity:
                            0.35
                    }
                ).addTo(map);
               /*
     * =====================================================
     * NDVI LEGEND
     * =====================================================
     */

    const legend =
        L.control({
            position: "bottomright"
        });


    legend.onAdd =
        function () {

            const div =
                L.DomUtil.create(
                    "div",
                    "geosense-legend"
                );


            div.innerHTML = `

                <div class="legend-title">
                    NDVI STATUS
                </div>

                <div class="legend-item">
                    <span
                        class="legend-dot healthy"
                    ></span>

                    Healthy
                </div>

                <div class="legend-item">
                    <span
                        class="legend-dot moderate"
                    ></span>

                    Moderate
                </div>

                <div class="legend-item">
                    <span
                        class="legend-dot stressed"
                    ></span>

                    Stressed
                </div>

            `;


            return div;

        };


    legend.addTo(map);


            /*
             * Popup information.
             */

            polygon.bindPopup(`

                <div
                    style="
                        min-width:190px;
                        font-family:Arial,sans-serif;
                    "
                >

                    <strong>
                        ${zone.name}
                    </strong>

                    <br><br>

                    NDVI:
                    <strong>
                        ${zone.ndvi}
                    </strong>

                    <br>

                    Status:
                    <strong
                        style="
                            color:${zone.color};
                        "
                    >
                        ${zone.status}
                    </strong>

                    <br><br>

                    <small>
                        This is an MVP
                        demonstration layer.
                    </small>

                </div>

            `);


            /*
             * Hover effect.
             */

            polygon.on(
                "mouseover",
                function () {

                    this.setStyle({

                        fillOpacity:
                            0.55,

                        weight:
                            3

                    });

                }
            );


            polygon.on(
                "mouseout",
                function () {

                    this.setStyle({

                        fillOpacity:
                            0.35,

                        weight:
                            2

                    });

                }
            );


            /*
             * Click event.
             */

            polygon.on(
                "click",
                function () {

                    console.log(
                        "NDVI zone selected:",
                        zone
                    );

                }
            );


            window
                .GeoSenseNDVILayers
                .push(polygon);

        }
    );



/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function initialiseKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * 1 = Overview
             * 2 = Vegetation
             * 3 = Risk
             * 4 = AI Advisory
             */

            const sections = {

                "1":
                    "overview",

                "2":
                    "vegetation",

                "3":
                    "risk",

                "4":
                    "advisory"

            };


            if (
                sections[event.key]
            ) {

                showSection(
                    sections[event.key]
                );

            }

        }
    );

}


/* =========================================================
   INITIALISE REFRESH BUTTON
   ========================================================= */

function initialiseRefresh() {

    const button =
        getElement("#refreshBtn");


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        refreshDashboard
    );

}


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

function initialiseGeoSense() {

    console.log(
        "--------------------------------------"
    );

    console.log(
        "LIVA GeoSense starting..."
    );

    console.log(
        "--------------------------------------"
    );


    initialiseNavigation();

    initialiseRefresh();

    initialiseMap();

    initialiseKeyboardControls();

    updateMetrics();


    console.log(
        "GeoSense dashboard ready."
    );

}


/* =========================================================
   START APPLICATION
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseGeoSense
    );

}

else {

    initialiseGeoSense();

}
