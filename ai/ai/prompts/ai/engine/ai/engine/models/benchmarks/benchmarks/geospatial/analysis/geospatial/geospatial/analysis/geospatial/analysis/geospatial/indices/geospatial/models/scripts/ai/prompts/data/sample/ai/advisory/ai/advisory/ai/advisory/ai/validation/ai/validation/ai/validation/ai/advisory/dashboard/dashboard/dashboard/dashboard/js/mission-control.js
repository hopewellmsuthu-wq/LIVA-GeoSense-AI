"use strict";


async function loadMissionControl() {

    try {

        const response =
            await fetch(
                "/api/field-tasks"
            );


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                "Could not load field tasks."
            );

        }


        renderTasks(
            result.tasks
        );


        renderAlerts(
            result.tasks
        );


    }

    catch (error) {

        console.error(
            "Mission Control:",
            error
        );

    }

}


function renderTasks(tasks) {

    const container =
        document.getElementById(
            "taskList"
        );


    const count =
        document.getElementById(
            "taskCount"
        );


    if (!container) {
        return;
    }


    count.textContent =
        `${tasks.length} task${
            tasks.length === 1
                ? ""
                : "s"
        }`;


    if (
        tasks.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No active field tasks.

            </div>

        `;

        return;

    }


    container.innerHTML =
        tasks
            .map(task => `

                <div class="task-item">

                    <div>

                        <div class="task-title">

                            ${task.id}

                        </div>

                        <div class="task-meta">

                            NDVI:
                            ${
                                Number(
                                    task.ndvi
                                ).toFixed(2)
                            }

                            ·

                            ${task.recommendation}

                        </div>

                    </div>


                    <span class="task-status">

                        ${task.status}

                    </span>


                    <strong>

                        ${task.priority}

                    </strong>

                </div>

            `)
            .join("");

}


function renderAlerts(tasks) {

    const container =
        document.getElementById(
            "alertsList"
        );


    if (!container) {
        return;
    }


    const alerts =
        tasks.filter(
            task =>
                task.status === "OPEN"
        );


    const activeAlerts =
        document.getElementById(
            "activeAlerts"
        );


    if (activeAlerts) {

        activeAlerts.textContent =
            alerts.length;

    }


    if (
        alerts.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No active alerts.

            </div>

        `;

        return;

    }


    container.innerHTML =
        alerts
            .map(task => `

                <div class="alert-item">

                    <h3>

                        ${task.priority}
                        PRIORITY

                    </h3>

                    <p>

                        ${task.recommendation}

                    </p>

                </div>

            `)
            .join("");

}


window.loadMissionControl =
    loadMissionControl;
