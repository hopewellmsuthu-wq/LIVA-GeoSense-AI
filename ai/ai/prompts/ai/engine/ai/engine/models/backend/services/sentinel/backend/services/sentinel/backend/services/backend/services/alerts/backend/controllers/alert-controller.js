"use strict";


const {

    getAlerts,

    getActiveAlerts,

    resolveAlert

} = require(
    "../services/alerts/alert-store"
);


function listAlerts(
    req,
    res
) {

    const alerts =
        getAlerts(
            req.query.farmId
        );


    return res.json({

        success: true,

        count:
            alerts.length,

        alerts

    });

}


function activeAlerts(
    req,
    res
) {

    const alerts =
        getActiveAlerts(
            req.query.farmId
        );


    return res.json({

        success: true,

        count:
            alerts.length,

        alerts

    });

}


function resolve(
    req,
    res
) {

    const alert =
        resolveAlert(
            req.params.alertId
        );


    if (!alert) {

        return res.status(404).json({

            success: false,

            error:
                "Alert not found."

        });

    }


    return res.json({

        success: true,

        alert

    });

}


module.exports = {

    listAlerts,

    activeAlerts,

    resolve

};
