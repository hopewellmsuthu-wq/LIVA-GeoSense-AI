"use strict";


const {
    createNDVIObservation
} = require(
    "../services/observations/ndvi-observation"
);


const {

    addObservation,

    getFarmHistory,

    getLatestObservation

} = require(
    "../services/observations/ndvi-history"
);


function saveObservation(
    req,
    res
) {

    try {

        const {

            farmId,

            date,

            meanNDVI,

            minNDVI,

            maxNDVI,

            cloudCoverage

        } = req.body;


        if (
            !farmId ||
            !date ||
            meanNDVI === undefined
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "farmId, date and meanNDVI are required."

            });

        }


        const observation =
            createNDVIObservation({

                farmId,

                date,

                meanNDVI,

                minNDVI:
                    minNDVI ?? meanNDVI,

                maxNDVI:
                    maxNDVI ?? meanNDVI,

                cloudCoverage:
                    cloudCoverage ?? 0

            });


        addObservation(
            observation
        );


        return res.status(201).json({

            success: true,

            observation

        });

    }

    catch (error) {

        console.error(
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

}


function getHistory(
    req,
    res
) {

    const history =
        getFarmHistory(
            req.params.farmId
        );


    return res.json({

        success: true,

        farmId:
            req.params.farmId,

        count:
            history.length,

        observations:
            history

    });

}


function getLatest(
    req,
    res
) {

    const observation =
        getLatestObservation(
            req.params.farmId
        );


    return res.json({

        success: true,

        observation

    });

}


module.exports = {

    saveObservation,

    getHistory,

    getLatest

};
