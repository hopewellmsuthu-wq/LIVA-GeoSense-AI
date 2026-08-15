"use strict";

const stressZones = [
    {
        id: "ZONE-001",
        name: "Northern Block",
        row: 1,
        column: 2,
        ndvi: 0.24,
        severity: "HIGH",
        stress: 38,
        recommendation:
            "Inspect irrigation coverage and check for possible crop stress."
    },

    {
        id: "ZONE-002",
        name: "Eastern Block",
        row: 2,
        column: 4,
        ndvi: 0.31,
        severity: "MODERATE",
        stress: 22,
        recommendation:
            "Monitor vegetation condition and compare with the next observation."
    },

    {
        id: "ZONE-003",
        name: "Southern Block",
        row: 4,
        column: 2,
        ndvi: 0.72,
        severity: "LOW",
        stress: 5,
        recommendation:
            "Vegetation condition is healthy. Continue routine monitoring."
    }
];
