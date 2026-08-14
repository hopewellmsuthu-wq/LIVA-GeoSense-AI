"use strict";


function classifyNDVI(value) {

    if (
        !Number.isFinite(value)
    ) {

        return {
            category: "NO_DATA",
            severity: 0,
            label: "No data"
        };

    }


    if (value < 0.20) {

        return {
            category: "SEVERE",
            severity: 4,
            label: "Severe vegetation stress"
        };

    }


    if (value < 0.35) {

        return {
            category: "HIGH",
            severity: 3,
            label: "High vegetation stress"
        };

    }


    if (value < 0.50) {

        return {
            category: "MODERATE",
            severity: 2,
            label: "Moderate vegetation stress"
        };

    }


    if (value < 0.65) {

        return {
            category: "HEALTHY",
            severity: 1,
            label: "Healthy vegetation"
        };

    }


    return {
        category: "VIGOROUS",
        severity: 0,
        label: "Vigorous vegetation"
    };

}


function analyseRaster(
    values,
    width,
    height
) {

    if (
        !Array.isArray(values) &&
        !ArrayBuffer.isView(values)
    ) {

        throw new Error(
            "NDVI raster values are required."
        );

    }


    const cells = [];

    let totalStress = 0;

    let validPixels = 0;


    for (
        let row = 0;
        row < height;
        row++
    ) {

        for (
            let column = 0;
            column < width;
            column++
        ) {

            const index =
                row * width +
                column;


            const value =
                Number(
                    values[index]
                );


            const classification =
                classifyNDVI(
                    value
                );


            if (
                classification.category !==
                "NO_DATA"
            ) {

                validPixels++;

                totalStress +=
                    classification.severity;

            }


            cells.push({

                row,

                column,

                ndvi:
                    Number.isFinite(value)
                        ? Number(
                            value.toFixed(4)
                        )
                        : null,

                category:
                    classification.category,

                severity:
                    classification.severity

            });

        }

    }


    const averageStress =
        validPixels > 0
            ? totalStress / validPixels
            : 0;


    return {

        width,

        height,

        validPixels,

        averageStress:
            Number(
                averageStress.toFixed(3)
            ),

        cells

    };

}


function identifyStressZones(
    analysis
) {

    const stressedCells =
        analysis.cells.filter(
            cell =>
                cell.severity >= 3
        );


    return {

        count:
            stressedCells.length,

        percentage:

            analysis.validPixels > 0

                ? Number(
                    (
                        stressedCells.length /
                        analysis.validPixels
                    * 100
                    ).toFixed(2)
                )

                : 0,

        cells:
            stressedCells

    };

}


module.exports = {

    classifyNDVI,

    analyseRaster,

    identifyStressZones

};
