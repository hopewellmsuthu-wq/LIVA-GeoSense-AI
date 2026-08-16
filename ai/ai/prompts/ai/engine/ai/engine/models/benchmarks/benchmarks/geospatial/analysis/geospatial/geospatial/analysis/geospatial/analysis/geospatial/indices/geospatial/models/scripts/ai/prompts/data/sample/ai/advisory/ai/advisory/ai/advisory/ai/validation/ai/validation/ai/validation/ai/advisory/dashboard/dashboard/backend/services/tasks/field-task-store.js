"use strict";


const tasks = [];


function createFieldTask(data) {

    const task = {

        id:
            `TASK-${Date.now()}`,

        farmId:
            data.farmId,

        zone:
            data.zone,

        ndvi:
            Number(data.ndvi),

        severity:
            data.severity,

        recommendation:
            data.recommendation,

        priority:
            getPriority(data.severity),

        status:
            "OPEN",

        assignedTo:
            null,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        completedAt:
            null

    };


    tasks.push(task);


    return task;

}


function getPriority(
    severity
) {

    if (
        severity === "HIGH" ||
        severity === "SEVERE"
    ) {

        return "URGENT";

    }


    if (
        severity === "MODERATE"
    ) {

        return "HIGH";

    }


    return "NORMAL";

}


function getTasks(
    farmId
) {

    return tasks.filter(
        task =>
            !farmId ||
            task.farmId === farmId
    );

}


function updateTask(
    taskId,
    changes
) {

    const task =
        tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {

        return null;

    }


    Object.assign(
        task,
        changes
    );


    task.updatedAt =
        new Date().toISOString();


    if (
        task.status ===
        "RESOLVED"
    ) {

        task.completedAt =
            new Date().toISOString();

    }


    return task;

}


module.exports = {

    createFieldTask,

    getTasks,

    updateTask

};
