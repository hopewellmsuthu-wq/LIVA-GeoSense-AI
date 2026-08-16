"use strict";


async function loadFieldTasks() {

    try {

        const response =
            await fetch(
                "/api/field-tasks?farmId=LGS-DEMO-001"
            );


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                result.error
            );

        }


        renderFieldTasks(
            result.tasks
        );

    }

    catch (error) {

        console.error(
            "Field task error:",
            error
        );

    }

}


function renderFieldTasks(
    tasks
) {

    const container =
        document.getElementById(
            "fieldTasksList"
        );


    const counter =
        document.getElementById(
            "taskCounter"
        );


    if (!container) {

        return;

    }


    const openTasks =
        tasks.filter(
            task =>
                task.status !==
                "RESOLVED"
        );


    if (counter) {

        counter.textContent =
            `${openTasks.length} OPEN`;

    }


    if (
        tasks.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-task-state">

                ✓ No intervention tasks

            </div>

        `;

        return;

    }


    container.innerHTML =
        tasks
            .map(
                task =>
                    createTaskCard(
                        task
                    )
            )
            .join("");

}


function createTaskCard(
    task
) {

    const priorityClass =
        task.priority
            .toLowerCase();


    return `

        <div
            class="field-task
            priority-${priorityClass}">

            <div class="task-main">

                <div class="task-icon">

                    ${getTaskIcon(
                        task.priority
                    )}

                </div>


                <div>

                    <span
                        class="task-zone">

                        ${
                            task.zone.name ||
                            task.zone.id
                        }

                    </span>


                    <h3>

                        Vegetation
                        intervention

                    </h3>


                    <p>

                        ${
                            task.recommendation ||
                            "Field inspection required."
                        }

                    </p>

                </div>

            </div>


            <div class="task-meta">

                <span>

                    NDVI
                    ${Number(
                        task.ndvi
                    ).toFixed(2)}

                </span>


                <span>

                    ${task.priority}

                </span>


                <span>

                    ${task.status}

                </span>

            </div>


            <div class="task-actions">

                ${
                    task.status !== "IN_PROGRESS"
                    &&
                    task.status !== "RESOLVED"
                    ?

                    `<button
                        onclick="updateFieldTask(
                            '${task.id}',
                            'IN_PROGRESS'
                        )">

                        Start Task

                    </button>`

                    : ""
                }


                ${
                    task.status === "IN_PROGRESS"

                    ?

                    `<button
                        onclick="updateFieldTask(
                            '${task.id}',
                            'RESOLVED'
                        )">

                        Mark Resolved

                    </button>`

                    : ""
                }

            </div>

        </div>

    `;

}


function getTaskIcon(
    priority
) {

    if (
        priority === "URGENT"
    ) {

        return "⚠";

    }


    if (
        priority === "HIGH"
    ) {

        return "●";

    }


    return "✓";

}


async function updateFieldTask(
    taskId,
    status
) {

    try {

        const response =
            await fetch(
                `/api/field-tasks/${taskId}`,
                {

                    method:
                        "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            status

                        })

                }
            );


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                result.error
            );

        }


        await loadFieldTasks();

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to update field task."
        );

    }

}


window.loadFieldTasks =
    loadFieldTasks;


window.updateFieldTask =
    updateFieldTask;
