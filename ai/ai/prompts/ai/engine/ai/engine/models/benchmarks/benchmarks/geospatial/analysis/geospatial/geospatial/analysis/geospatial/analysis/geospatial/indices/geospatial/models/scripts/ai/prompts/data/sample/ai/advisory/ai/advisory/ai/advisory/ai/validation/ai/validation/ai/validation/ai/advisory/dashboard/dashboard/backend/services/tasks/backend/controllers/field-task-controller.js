"use strict";


const {

    createFieldTask,

    getTasks,

    updateTask

} = require(
    "../services/tasks/field-task-store"
);


function createTask(
    req,
    res
) {

    try {

        const {

            farmId,

            zone,

            ndvi,

            severity,

            recommendation

        } = req.body;


        if (
            !farmId ||
            !zone ||
            ndvi === undefined ||
            !severity
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "farmId, zone, ndvi and severity are required."

            });

        }


        const task =
            createFieldTask({

                farmId,

                zone,

                ndvi,

                severity,

                recommendation

            });


        return res.status(201).json({

            success: true,

            task

        });

    }

    catch (error) {

        console.error(
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

}


function listTasks(
    req,
    res
) {

    const tasks =
        getTasks(
            req.query.farmId
        );


    return res.json({

        success: true,

        count:
            tasks.length,

        tasks

    });

}


function updateTaskStatus(
    req,
    res
) {

    const task =
        updateTask(

            req.params.taskId,

            {

                status:
                    req.body.status,

                assignedTo:
                    req.body.assignedTo

            }

        );


    if (!task) {

        return res.status(404).json({

            success: false,

            error:
                "Field task not found."

        });

    }


    return res.json({

        success: true,

        task

    });

}


module.exports = {

    createTask,

    listTasks,

    updateTaskStatus

};
