"use strict";

const LIVA_API = window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://liva-geosense-ai.onrender.com";

async function getNDVI(nir, red) {
    const url =
        `${LIVA_API}/api/ndvi?nir=${encodeURIComponent(nir)}&red=${encodeURIComponent(red)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`NDVI API error: ${response.status}`);
    }

    return await response.json();
}

async function testLiveNDVI() {
    try {
        const result = await getNDVI(0.65, 0.15);

        console.log("🌍 LIVA GeoSense Live NDVI:", result);

        if (!result.success) {
            throw new Error("NDVI API returned an unsuccessful response");
        }

        const liveNDVI = Number(result.ndvi);

        /*
         * Connect live NDVI to the GeoSense application state.
         */
        if (
            typeof GeoSenseState !== "undefined" &&
            GeoSenseState.observations
        ) {
            GeoSenseState.observations.currentNDVI = liveNDVI;
            GeoSenseState.lastUpdated = new Date();
        }

        /*
         * Main dashboard NDVI
         */
        const ndviElement =
            document.getElementById("currentNDVIValue");

        if (ndviElement) {
            ndviElement.textContent = liveNDVI.toFixed(2);
        }

        /*
         * Timeline NDVI
         */
        const timelineNDVI =
            document.getElementById("timelineCurrentNDVI");

        if (timelineNDVI) {
            timelineNDVI.textContent = liveNDVI.toFixed(2);
        }

        /*
         * Store live value globally for other dashboard modules.
         */
        window.LivaLiveNDVI = liveNDVI;

        console.log(
            "✅ Live NDVI connected to GeoSense:",
            liveNDVI
        );

        return result;

    } catch (error) {

        console.error(
            "❌ NDVI API connection failed:",
            error
        );

        return null;
    }
}

window.LivaGeoSense = {
    getNDVI,
    testLiveNDVI
};

document.addEventListener(
    "DOMContentLoaded",
    () => {
        testLiveNDVI();
    }
);
