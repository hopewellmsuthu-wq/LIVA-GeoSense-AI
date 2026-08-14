/**
 * =========================================================
 * LIVA GEOSENSE
 * Satellite Data Configuration
 * =========================================================
 *
 * This module defines the standard format that GeoSense
 * expects from satellite observations.
 *
 * The dashboard does NOT depend directly on a satellite
 * provider.
 *
 * Later:
 *
 * Sentinel-2
 *     ↓
 * Processing service
 *     ↓
 * GeoSense Satellite Observation
 *     ↓
 * Dashboard
 */

"use strict";


const GeoSenseSatelliteConfig = {

    provider: "Sentinel-2",

    mission: "Copernicus Sentinel-2",

    resolution: 10,

    expectedBands: {

        red: "B04",

        nir: "B08"

    },

    cloudFiltering: {

        enabled: true,

        maximumCloudPercentage: 20

    },

    indices: {

        ndvi: {

            name:
                "Normalized Difference Vegetation Index",

            formula:
                "(NIR - RED) / (NIR + RED)"

        }

    }

};


if (typeof window !== "undefined") {

    window.GeoSenseSatelliteConfig =
        GeoSenseSatelliteConfig;

}
