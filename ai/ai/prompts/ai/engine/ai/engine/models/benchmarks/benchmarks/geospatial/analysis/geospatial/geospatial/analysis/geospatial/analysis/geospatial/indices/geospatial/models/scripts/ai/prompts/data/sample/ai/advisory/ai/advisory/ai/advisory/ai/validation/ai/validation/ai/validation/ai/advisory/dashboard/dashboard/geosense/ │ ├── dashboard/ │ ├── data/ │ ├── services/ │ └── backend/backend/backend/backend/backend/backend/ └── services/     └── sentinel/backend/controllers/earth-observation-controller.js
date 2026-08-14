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
