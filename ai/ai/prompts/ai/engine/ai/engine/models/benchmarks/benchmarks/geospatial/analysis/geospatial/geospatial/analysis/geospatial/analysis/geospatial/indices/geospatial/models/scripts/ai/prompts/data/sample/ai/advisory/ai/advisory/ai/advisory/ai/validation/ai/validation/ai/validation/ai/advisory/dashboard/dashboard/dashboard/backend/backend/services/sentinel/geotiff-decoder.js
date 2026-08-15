"use strict";

const GeoTIFF = require("geotiff");


async function decodeNDVIGeoTIFF(
    arrayBuffer
) {

    if (!arrayBuffer) {

        throw new Error(
            "GeoTIFF data is required."
        );

    }


    const tiff =
        await GeoTIFF.fromArrayBuffer(
            arrayBuffer
        );


    const image =
        await tiff.getImage();


    const width =
        image.getWidth();


    const height =
        image.getHeight();


    const rasters =
        await image.readRasters({
            interleave: true
        });


    const values =
        Array.from(rasters)
            .map(Number)
            .filter(
                value =>
                    Number.isFinite(value)
            );


    return {

        width,

        height,

        values

    };

}


module.exports = {
    decodeNDVIGeoTIFF
};
