/**
 * =========================================================
 * LIVA GEOSENSE
 * Demonstration Satellite Catalogue
 * =========================================================
 *
 * DEMONSTRATION DATA ONLY.
 */

"use strict";


const GeoSenseDemoCatalogue = [

    {
        id:
            "S2-DEMO-001",

        provider:
            "Sentinel-2 DEMO",

        acquisitionDate:
            "2026-08-13",

        cloudCoverPercentage:
            8,

        resolutionMetres:
            10,

        bands: {

            B04:
                0.18,

            B08:
                0.52

        }

    },


    {
        id:
            "S2-DEMO-002",

        provider:
            "Sentinel-2 DEMO",

        acquisitionDate:
            "2026-08-08",

        cloudCoverPercentage:
            17,

        resolutionMetres:
            10,

        bands: {

            B04:
                0.16,

            B08:
                0.55

        }

    },


    {
        id:
            "S2-DEMO-003",

        provider:
            "Sentinel-2 DEMO",

        acquisitionDate:
            "2026-08-03",

        cloudCoverPercentage:
            34,

        resolutionMetres:
            10,

        bands: {

            B04:
                0.22,

            B08:
                0.47

        }

    }

];


if (
    typeof window !== "undefined"
) {

    window.GeoSenseDemoCatalogue =
        GeoSenseDemoCatalogue;

      }
