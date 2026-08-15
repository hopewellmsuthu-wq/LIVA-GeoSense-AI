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
