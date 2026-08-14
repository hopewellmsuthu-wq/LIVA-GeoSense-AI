/**
 * =========================================================
 * LIVA GEOSENSE
 * DEMONSTRATION FARM
 * =========================================================
 */

"use strict";


const GeoSenseDemoFarm = {

    id:
        "LGS-DEMO-001",

    name:
        "GeoSense Demonstration Farm",

    crop:
        "Maize",

    hectares:
        12.5,

    location: {

        latitude:
            -31.5833,

        longitude:
            28.7833

    },


    boundingBox: {

        south:
            -31.5850,

        west:
            28.7812,

        north:
            -31.5812,

        east:
            28.7860

    }

};


if (
    typeof window !== "undefined"
) {

    window.GeoSenseDemoFarm =
        GeoSenseDemoFarm;

          }
