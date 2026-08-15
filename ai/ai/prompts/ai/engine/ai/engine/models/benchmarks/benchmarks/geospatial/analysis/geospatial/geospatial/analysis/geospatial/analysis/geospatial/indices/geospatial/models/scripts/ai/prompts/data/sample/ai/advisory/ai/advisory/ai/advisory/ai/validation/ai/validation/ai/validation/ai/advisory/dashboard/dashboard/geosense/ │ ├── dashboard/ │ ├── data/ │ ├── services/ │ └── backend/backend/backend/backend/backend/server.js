const {

    searchScenes,

    processNDVIRequest

} = require(
    "./controllers/earth-observation-controller"
);
/**
 * =========================================================
 * LIVA GEOSENSE
 * BACKEND API
 * =========================================================
 */

"use strict";


require("dotenv").config();

const {
    searchScenes
} = require(
    "./controllers/earth-observation-controller"
);


const express =
    require("express");


const cors =
    require("cors");


const app =
    express();


const PORT =
    process.env.PORT || 3000;


/**
 * =========================================================
 * MIDDLEWARE
 * =========================================================
 */

app.use(
    cors()
);


app.use(
    express.json()
);


/**
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success:
                true,

            service:
                "LIVA GeoSense API",

            status:
                "operational",

            version:
                "1.0.0",

            timestamp:
                new Date().toISOString()

        });

    }
);


/**
 * =========================================================
 * API INFORMATION
 * =========================================================
 */

app.get(
    "/api",
    (req, res) => {

        res.json({

            name:
                "LIVA GeoSense API",

            description:
                "Earth observation and agricultural intelligence backend.",

            endpoints: [

                "GET /api",

                "GET /api/health",

                "POST /api/earth-observation/scenes",

                "POST /api/earth-observation/ndvi"

            ]

        });

    }
);


/**
 * =========================================================
 * EARTH OBSERVATION — SCENE SEARCH
 * =========================================================
 *
 * This is currently an API contract.
 * Real provider integration comes next.
 */

app.post(
    "/api/earth-observation/ndvi",
    processNDVIRequest
);

        const {

            farmId,

            boundingBox,

            startDate,

            endDate,

            maximumCloudPercentage = 20

        } = req.body;


        if (!farmId) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "farmId is required."

            });

        }


        if (!boundingBox) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "boundingBox is required."

            });

        }


        if (!startDate || !endDate) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "startDate and endDate are required."

            });

        }


        return res.json({

            success:
                true,

            status:
                "REQUEST_ACCEPTED",

            message:
                "Earth observation scene search request received.",

            request: {

                farmId,

                boundingBox,

                startDate,

                endDate,

                maximumCloudPercentage

            }

        });

    }
);


/**
 * =========================================================
 * NDVI ENDPOINT
 * =========================================================
 */

app.post(
    "/api/earth-observation/ndvi",
    (req, res) => {

        const {

            farmId,

            sceneId

        } = req.body;


        if (!farmId) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "farmId is required."

            });

        }


        if (!sceneId) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "sceneId is required."

            });

        }


        res.json({

            success:
                true,

            status:
                "PROCESSING",

            message:
                "NDVI processing request accepted.",

            request: {

                farmId,

                sceneId

            }

        });

    }
);


/**
 * =========================================================
 * 404 HANDLER
 * =========================================================
 */

app.use(
    (req, res) => {

        res.status(404).json({

            success:
                false,

            error:
                "Endpoint not found."

        });

    }
);


/**
 * =========================================================
 * ERROR HANDLER
 * =========================================================
 */

app.use(
    (error, req, res, next) => {

        console.error(
            error
        );


        res.status(500).json({

            success:
                false,

            error:
                "Internal server error."

        });

    }
);


/**
 * =========================================================
 * START SERVER
 * =========================================================
 */

app.listen(
    PORT,
    () => {

        console.log(
            "========================================"
        );

        console.log(
            "LIVA GEOSENSE API"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/api/health`
        );

        console.log(
            "========================================"
        );

    }
);

const {
    createTask,
    getTasks
} = require(
    "./controllers/field-task-controller"
);

    app.post(
    "/api/field-tasks",
    createTask
);


app.get(
    "/api/field-tasks",
    getTasks
);

const {

    saveObservation,

    getHistory,

    getLatest

} = require(
    "./controllers/ndvi-history-controller"
);


app.post(
    "/api/ndvi/observations",
    saveObservation
);


app.get(
    "/api/ndvi/history/:farmId",
    getHistory
);


app.get(
    "/api/ndvi/latest/:farmId",
    getLatest
);
const {

    listAlerts,

    activeAlerts,

    resolve

} = require(
    "./controllers/alert-controller"
);


app.get(
    "/api/alerts",
    listAlerts
);


app.get(
    "/api/alerts/active",
    activeAlerts
);


app.patch(
    "/api/alerts/:alertId/resolve",
    resolve
);
