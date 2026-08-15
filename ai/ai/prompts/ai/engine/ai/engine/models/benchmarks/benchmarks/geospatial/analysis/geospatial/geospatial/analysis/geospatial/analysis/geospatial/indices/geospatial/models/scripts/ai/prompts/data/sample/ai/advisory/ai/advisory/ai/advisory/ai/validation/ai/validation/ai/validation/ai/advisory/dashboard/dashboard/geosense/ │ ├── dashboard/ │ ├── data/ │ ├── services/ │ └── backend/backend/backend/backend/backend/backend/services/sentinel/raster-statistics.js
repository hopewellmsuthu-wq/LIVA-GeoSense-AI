"use strict";


function calculateRasterStatistics(
    values
) {

    const validValues =
        Array.from(values)
            .map(Number)
            .filter(
                value =>
                    Number.isFinite(value)
            );


    if (
        validValues.length === 0
    ) {

        return {

            meanNDVI: null,

            minNDVI: null,

            maxNDVI: null

        };

    }


    const total =
        validValues.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const mean =
        total /
        validValues.length;


    return {

        meanNDVI:
            Number(
                mean.toFixed(4)
            ),

        minNDVI:
            Number(
                Math.min(
                    ...validValues
                ).toFixed(4)
            ),

        maxNDVI:
            Number(
                Math.max(
                    ...validValues
                ).toFixed(4)
            )

    };

}


module.exports = {
    calculateRasterStatistics
};
