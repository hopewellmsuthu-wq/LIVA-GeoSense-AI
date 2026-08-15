"use strict";


function createNDVIObservation({
    farmId,
    date,
    meanNDVI,
    minNDVI,
    maxNDVI,
    cloudCoverage
}) {

    return {

        id:
            `NDVI-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        farmId,

        date,

        meanNDVI:
            Number(
                Number(meanNDVI).toFixed(4)
            ),

        minNDVI:
            Number(
                Number(minNDVI).toFixed(4)
            ),

        maxNDVI:
            Number(
                Number(maxNDVI).toFixed(4)
            ),

        cloudCoverage:
            Number(
                Number(cloudCoverage).toFixed(2)
            ),

        source:
            "Sentinel-2",

        createdAt:
            new Date().toISOString()

    };

}


module.exports = {
    createNDVIObservation
};
