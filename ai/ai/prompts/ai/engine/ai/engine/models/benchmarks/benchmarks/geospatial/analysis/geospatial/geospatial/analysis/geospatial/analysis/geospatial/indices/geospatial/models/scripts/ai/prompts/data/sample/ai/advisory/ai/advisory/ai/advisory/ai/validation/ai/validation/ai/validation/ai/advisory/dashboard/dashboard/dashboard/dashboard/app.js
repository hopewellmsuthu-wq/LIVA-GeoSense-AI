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

    const map =
        getElement("#farmMap");


    if (!map) {

        return;

    }


    map.addEventListener(
        "click",
        () => {

            map.classList.toggle(
                "map-focused"
            );


            console.log(
                "GeoSense farm map selected."
            );

        }
    );

}


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
