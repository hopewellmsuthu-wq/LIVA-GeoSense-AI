"use strict";

const GeoTIFF = require("geotiff");

async function calculateNDVIStatistics(buffer) {

    const tiff =
        await GeoTIFF.fromArrayBuffer(
            buffer
        );

    const image =
        await tiff.getImage();

    const raster =
        await image.readRasters({
            interleave: true
        });

    let validPixels = 0;
    let sum = 0;
    let minimum = Infinity;
    let maximum = -Infinity;

    for (const value of raster) {

        if (
            Number.isFinite(value) &&
            value >= -1 &&
            value <= 1
        ) {

            validPixels++;

            sum += value;

            minimum =
                Math.min(
                    minimum,
                    value
                );

            maximum =
                Math.max(
                    maximum,
                    value
                );

        }

    }

    const mean =
        validPixels > 0
            ? sum / validPixels
            : null;

    return {

        pixelCount:
            validPixels,

        minimum:
            validPixels > 0
                ? minimum
                : null,

        maximum:
            validPixels > 0
                ? maximum
                : null,

        mean,

        health:

            mean === null
                ? "NO_DATA"

                : mean < 0.20
                    ? "LOW"

                    : mean < 0.40
                        ? "MODERATE"

                        : mean < 0.60
                            ? "GOOD"

                            : "EXCELLENT"

    };

}

module.exports = {
    calculateNDVIStatistics
};
