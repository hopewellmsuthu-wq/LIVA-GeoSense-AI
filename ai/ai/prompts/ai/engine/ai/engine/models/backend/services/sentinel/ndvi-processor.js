"use strict";


const {
    decodeNDVIGeoTIFF
} = require(
    "./geotiff-decoder"
);


const {
    calculateRasterStatistics
} = require(
    "./raster-statistics"
);


async function processNDVI(
    arrayBuffer
) {

    const decoded =
        await decodeNDVIGeoTIFF(
            arrayBuffer
        );


    const statistics =
        calculateRasterStatistics(
            decoded.values
        );


    return {

        width:
            decoded.width,

        height:
            decoded.height,

        statistics

    };

}


module.exports = {
    processNDVI
};

const arrayBuffer =
    await response.arrayBuffer();

const {
    processNDVI
} = require(
    "./services/sentinel/ndvi-processor"
);


const processed =
    await processNDVI(
        arrayBuffer
    );

console.log(
    processed.statistics
);

const {
    createNDVIObservation
} = require(
    "./services/observations/ndvi-observation"
);


const {
    addObservation
} = require(
    "./services/observations/ndvi-history"
);


const observation =
    createNDVIObservation({

        farmId,

        date:
            new Date()
                .toISOString()
                .slice(0, 10),

        meanNDVI:
            processed.statistics.meanNDVI,

        minNDVI:
            processed.statistics.minNDVI,

        maxNDVI:
            processed.statistics.maxNDVI,

        cloudCoverage:
            cloudCoverage || 0

    });


addObservation(
    observation
);

    function isValidObservation(
    statistics
) {

    if (!statistics) {
        return false;
    }


    if (
        statistics.meanNDVI === null
    ) {

        return false;

    }


    if (
        statistics.meanNDVI < -1 ||
        statistics.meanNDVI > 1
    ) {

        return false;

    }


    return true;

}


module.exports = {
    isValidObservation
};
