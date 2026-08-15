"use strict";


const alerts = [];


function addAlert(alert) {

    alerts.push(alert);

    return alert;

}


function getAlerts(
    farmId
) {

    return alerts.filter(
        alert =>
            !farmId ||
            alert.farmId === farmId
    );

}


function getActiveAlerts(
    farmId
) {

    return getAlerts(
        farmId
    ).filter(
        alert =>
            alert.status === "ACTIVE"
    );

}


function resolveAlert(
    alertId
) {

    const alert =
        alerts.find(
            item =>
                item.id === alertId
        );


    if (!alert) {

        return null;

    }


    alert.status =
        "RESOLVED";

    alert.resolvedAt =
        new Date().toISOString();


    return alert;

}


module.exports = {

    addAlert,

    getAlerts,

    getActiveAlerts,

    resolveAlert

};
