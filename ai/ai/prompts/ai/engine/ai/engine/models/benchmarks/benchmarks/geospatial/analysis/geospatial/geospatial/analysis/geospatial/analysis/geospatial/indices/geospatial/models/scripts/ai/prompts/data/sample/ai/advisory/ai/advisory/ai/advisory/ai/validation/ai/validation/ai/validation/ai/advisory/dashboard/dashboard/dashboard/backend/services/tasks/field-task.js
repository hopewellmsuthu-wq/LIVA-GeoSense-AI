"use strict";

function createFieldTask({
    farmId,
    zone,
    ndvi,
    severity,
    recommendation
}) {

    return {

        id:
            `TASK-${Date.now()}`,

        farmId,

        zone,

        ndvi,

        severity,

        recommendation,

        status:
            "OPEN",

        priority:
            severity === "SEVERE"
                ? "URGENT"
                : severity === "HIGH"
                    ? "HIGH"
                    : "NORMAL",

        createdAt:
            new Date().toISOString(),

        completedAt:
            null

    };

}


module.exports = {
    createFieldTask
};
