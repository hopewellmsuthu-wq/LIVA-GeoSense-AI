"use strict";

const {
    createFieldTask
} = require(
    "../services/tasks/field-task"
);


const tasks = [];


function createTask(req, res) {

    try {

        const {

            farmId,

            zone,

            ndvi,

            severity,

            recommendation

        } = req.body;


        if (!farmId) {

            return res.status(400).json({

                success: false,

                error:
                    "farmId is required."

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


        tasks.push(task);


        return res.status(201).json({

            success: true,

            task

        });

    }

    catch (error) {

        console.error(
            "Field task error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

}


function getTasks(req, res) {

    return res.json({

        success: true,

        count:
            tasks.length,

        tasks

    });

}


module.exports = {

    createTask,

    getTasks

};
