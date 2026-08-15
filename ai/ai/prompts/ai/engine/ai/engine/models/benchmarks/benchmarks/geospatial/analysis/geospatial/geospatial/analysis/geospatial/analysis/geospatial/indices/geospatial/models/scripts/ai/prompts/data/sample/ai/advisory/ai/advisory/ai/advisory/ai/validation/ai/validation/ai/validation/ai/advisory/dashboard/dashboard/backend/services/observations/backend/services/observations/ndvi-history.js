"use strict";


const observations = [];


function addObservation(
    observation
) {

    observations.push(
        observation
    );


    observations.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    return observation;

}


function getFarmHistory(
    farmId
) {

    return observations.filter(
        observation =>
            observation.farmId === farmId
    );

}


function getLatestObservation(
    farmId
) {

    const history =
        getFarmHistory(
            farmId
        );


    if (
        history.length === 0
    ) {

        return null;

    }


    return history[
        history.length - 1
    ];

}


module.exports = {

    addObservation,

    getFarmHistory,

    getLatestObservation

};
