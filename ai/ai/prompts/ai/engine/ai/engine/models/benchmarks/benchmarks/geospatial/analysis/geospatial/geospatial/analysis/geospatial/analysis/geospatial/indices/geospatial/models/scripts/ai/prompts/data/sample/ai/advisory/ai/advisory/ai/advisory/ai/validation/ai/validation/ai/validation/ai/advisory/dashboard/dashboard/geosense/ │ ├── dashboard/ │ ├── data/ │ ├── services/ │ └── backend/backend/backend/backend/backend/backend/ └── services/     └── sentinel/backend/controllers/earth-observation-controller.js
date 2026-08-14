const {
    processNDVI
} = require(
    "../services/sentinel/ndvi-processing"
);

async function processNDVIRequest(
    req,
    res
) {

    try {

        const {

            boundingBox,

            startDate,

            endDate,

            width = 512,

            height = 512

        } = req.body;


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


        const result =
            await processNDVI({

                boundingBox,

                startDate,

                endDate,

                width,

                height

            });
        const statistics =
    await calculateNDVIStatistics(
        result.buffer
    );


        res.setHeader(
            "Content-Type",
            result.contentType
        );


        res.setHeader(
            "X-GeoSense-Product",
            "Sentinel-2 NDVI"
        );


        return res.send(
            Buffer.from(
                result.buffer
            )
        );

    }

    catch (error) {

        console.error(
            "NDVI processing error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            status:
                "NDVI_PROCESSING_FAILED",

            error:
                error.message

        });

    }

}



module.exports = {

    searchScenes,

    processNDVIRequest

};

/**
 * =========================================================
 * LIVA GEOSENSE
 * EARTH OBSERVATION CONTROLLER
 * =========================================================
 */

"use strict";


const {

    searchSentinelScenes,

    normaliseScene

} = require(
    "../services/sentinel/scene-search"
);


async function searchScenes(req, res) {

    try {

        const {

            farmId,

            boundingBox,

            startDate,

            endDate,

            maximumCloudPercentage = 20,

            limit = 10

        } = req.body;


        if (!farmId) {

            return res.status(400).json({

                success:
                    false,

                error:
                    "farmId is required."

            });

        }


        const scenes =
            await searchSentinelScenes({

                boundingBox,

                startDate,

                endDate,

                maximumCloudPercentage,

                limit

            });


        const normalisedScenes =
            scenes.map(
                normaliseScene
            );


        return res.json({

            success:
                true,

            status:
                "SCENES_FOUND",

            provider:
                "Copernicus Data Space",

            collection:
                "sentinel-2-l2a",

            farmId,

            count:
                normalisedScenes.length,

            scenes:
                normalisedScenes

        });

    }

    catch (error) {

        console.error(
            "Scene discovery error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            status:
                "SCENE_SEARCH_FAILED",

            error:
                error.message

        });

    }

}


module.exports = {

    searchScenes

};

const {
    calculateNDVIStatistics
} = require(
    "../services/sentinel/ndvi-statistics"
);

res.setHeader(
    "Content-Type",
    result.contentType
);

res.setHeader(
    "X-GeoSense-Product",
    "Sentinel-2 NDVI"
);

res.setHeader(
    "X-GeoSense-Mean-NDVI",
    String(
        statistics.mean ?? ""
    )
);

return res.send(
    Buffer.from(
        result.buffer
    )
);
