/**
 * =========================================================
 * LIVA GEOSENSE
 * Demonstration Satellite Observation
 * =========================================================
 *
 * This is DEMONSTRATION DATA.
 *
 * It is deliberately separated from the real satellite
 * integration so that we never represent simulated data
 * as actual satellite imagery.
 */

"use strict";


const demoSatelliteObservation = {

    provider:
        "Sentinel-2 DEMO",

    acquisitionDate:
        "2026-08-13",

    farmId:
        "LGS-DEMO-001",

    cloudCoverPercentage:
        8,

    resolutionMetres:
        10,

    bands: {

        red:
            0.18,

        nir:
            0.52

    },

    sourceType:
        "DEMONSTRATION",

    verified:
        false

};


if (typeof window !== "undefined") {

    window.GeoSenseDemoSatelliteObservation =
        demoSatelliteObservation;

  }
