"use strict";

let demoRunning = false;

const demoSteps = [
    {
        title: "Satellite observation received",
        message:
            "GeoSense has received a new satellite observation.",
        delay: 1500
    },

    {
        title: "Vegetation deterioration detected",
        message:
            "NDVI has declined from 0.71 to 0.46.",
        delay: 2500
    },

    {
        title: "High-risk zone identified",
        message:
            "Northern Block requires field inspection.",
        delay: 2500
    },

    {
        title: "Recommended action generated",
        message:
            "GeoSense recommends checking irrigation coverage.",
        delay: 2500
    }
];


function startGeoSenseDemo() {

    if (demoRunning) {
        return;
    }

    demoRunning = true;

    const button =
        document.getElementById(
            "demoModeButton"
        );

    if (button) {

        button.textContent =
            "● Demo Running";

        button.disabled = true;
    }

    runDemoStep(0);
}


function runDemoStep(index) {

    if (
        index >=
        demoSteps.length
    ) {

        finishDemo();

        return;
    }

    const step =
        demoSteps[index];

    showDemoNotification(
        step.title,
        step.message
    );

    setTimeout(
        () => {

            runDemoStep(
                index + 1
            );

        },
        step.delay
    );
}


function showDemoNotification(
    title,
    message
) {

    let notification =
        document.getElementById(
            "demoNotification"
        );

    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "demoNotification";

        notification.className =
            "demo-notification";

        document.body.appendChild(
            notification
        );
    }

    notification.innerHTML = `

        <div class="demo-notification-icon">
            ●
        </div>

        <div>

            <strong>
                ${title}
            </strong>

            <p>
                ${message}
            </p>

        </div>

    `;

    notification.classList.add(
        "show"
    );

    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

        },
        2200
    );
}


function finishDemo() {

    demoRunning = false;

    const button =
        document.getElementById(
            "demoModeButton"
        );

    if (button) {

        button.textContent =
            "↻ Run Demo Again";

        button.disabled = false;
    }

    if (
        typeof highlightAffectedZones ===
        "function"
    ) {

        highlightAffectedZones();
    }

    showDemoNotification(

        "GeoSense demonstration complete",

        "Detection, analysis and field intervention workflow demonstrated."

    );
}


window.startGeoSenseDemo =
    startGeoSenseDemo;
