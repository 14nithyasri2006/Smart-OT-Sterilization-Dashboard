// ==================================================
// SMART OT STERILIZATION DASHBOARD
// START BUTTON + AUTOMATIC SYSTEM
// 30 SECOND STERILIZATION
// ==================================================

let uvDose = 0;

let personDetected = false;

let doorClosed = true;

let sensorsOnline = true;

let sterilizationRunning = false;

let cycleCompleted = false;

let safetyEventActive = false;

let systemStarted = false;


// ==================================================
// START BUTTON
// ==================================================

const startSterilizationBtn =
    document.getElementById(
        "startSterilizationBtn"
    );


startSterilizationBtn.addEventListener(
    "click",
    startSterilization
);


function startSterilization() {

    if (systemStarted) {
        return;
    }


    if (!sensorsOnline) {

        addEvent(
            "Cannot start: UV-C sensors offline",
            "🚨"
        );

        return;
    }


    if (personDetected) {

        addEvent(
            "Cannot start: Person detected",
            "🚨"
        );

        return;
    }


    if (!doorClosed) {

        addEvent(
            "Cannot start: OT door is open",
            "🚪"
        );

        return;
    }


    systemStarted = true;

    uvDose = 0;

    cycleCompleted = false;

    sterilizationRunning = false;


    startSterilizationBtn.innerText =
        "🟢 STERILIZATION RUNNING";

    startSterilizationBtn.disabled =
        true;


    addEvent(
        "START button pressed",
        "▶️"
    );


    addEvent(
        "All safety conditions satisfied",
        "🟢"
    );


    addEvent(
        "UV-C sterilization started",
        "☀️"
    );


    updateDashboard();

}


// ==================================================
// BUZZER / AUDIO
// ==================================================

let audioContext = null;

let soundEnabled = false;

let alarmPlaying = false;


const enableSoundBtn =
    document.getElementById(
        "enableSoundBtn"
    );


enableSoundBtn.addEventListener(
    "click",
    enableSound
);


function enableSound() {

    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    soundEnabled = true;


    document.getElementById(
        "soundStatus"
    ).innerText =
        "Sound enabled";


    enableSoundBtn.innerText =
        "🔊 Alarm Enabled";


    enableSoundBtn.disabled =
        true;


    addEvent(
        "Safety alarm audio enabled",
        "🔊"
    );

}


// ==================================================
// BEEP SOUND
// ==================================================

function beep(
    frequency = 800,
    duration = 250
) {

    if (!soundEnabled) {
        return;
    }


    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type =
        "square";


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime +
        duration / 1000
    );

}


// ==================================================
// SAFETY ALARM
// ==================================================

function startSafetyAlarm() {

    if (!soundEnabled) {

        document.getElementById(
            "alarmStatus"
        ).innerText =
            "🔇 ENABLE SOUND";

        return;
    }


    if (alarmPlaying) {
        return;
    }


    alarmPlaying = true;


    document.getElementById(
        "alarmStatus"
    ).innerText =
        "🔊 ALARM ACTIVE";


    let count = 0;


    const alarmInterval =
        setInterval(() => {

            beep(900, 180);

            count++;


            if (
                count >= 6 ||
                (!personDetected &&
                doorClosed)
            ) {

                clearInterval(
                    alarmInterval
                );


                alarmPlaying =
                    false;


                document.getElementById(
                    "alarmStatus"
                ).innerText =
                    "🔇 SILENT";

            }

        }, 350);

}


// ==================================================
// COMPLETION SOUND
// ==================================================

function completionSound() {

    if (!soundEnabled) {
        return;
    }


    beep(600, 150);


    setTimeout(() => {

        beep(800, 150);

    }, 200);


    setTimeout(() => {

        beep(1000, 250);

    }, 400);

}


// ==================================================
// CHART
// ==================================================

const chartCanvas =
    document.getElementById(
        "uvChart"
    );


const uvChart =
    new Chart(
        chartCanvas,
        {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label:
                        "UV-C Dose (%)",

                    data: [],

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio:
                    false,

                animation: false,

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        title: {

                            display: true,

                            text:
                                "UV-C Dose (%)"

                        }

                    }

                }

            }

        }
    );


// ==================================================
// TIME
// ==================================================

function getTime() {

    return new Date()
        .toLocaleTimeString();

}


// ==================================================
// EVENT LOG
// ==================================================

function addEvent(
    message,
    icon
) {

    const log =
        document.getElementById(
            "eventLog"
        );


    const event =
        document.createElement(
            "div"
        );


    event.className =
        "event";


    event.innerHTML = `

        <span class="event-time">
            ${getTime()}
        </span>

        <span>
            ${icon}
        </span>

        <span>
            ${message}
        </span>

    `;


    log.appendChild(event);


    while (
        log.children.length > 12
    ) {

        log.removeChild(
            log.firstElementChild
        );

    }


    log.scrollTop =
        log.scrollHeight;

}


// ==================================================
// SENSOR DATA
// ==================================================

let sensor1 = 250;

let sensor2 = 247;

let sensor3 = 252;

let sensor4 = 249;


function generateSensorData() {

    sensor1 =
        250 +
        Math.floor(
            Math.random() * 7
        ) - 3;


    sensor2 =
        247 +
        Math.floor(
            Math.random() * 7
        ) - 3;


    sensor3 =
        252 +
        Math.floor(
            Math.random() * 7
        ) - 3;


    sensor4 =
        249 +
        Math.floor(
            Math.random() * 7
        ) - 3;


    document.getElementById(
        "sensor1Value"
    ).innerText = sensor1;


    document.getElementById(
        "sensor2Value"
    ).innerText = sensor2;


    document.getElementById(
        "sensor3Value"
    ).innerText = sensor3;


    document.getElementById(
        "sensor4Value"
    ).innerText = sensor4;


    document.getElementById(
        "mapSensor1"
    ).innerText = sensor1;


    document.getElementById(
        "mapSensor2"
    ).innerText = sensor2;


    document.getElementById(
        "mapSensor3"
    ).innerText = sensor3;


    document.getElementById(
        "mapSensor4"
    ).innerText = sensor4;

}


// ==================================================
// SAFETY CHECK
// ==================================================

function safetyCheck() {

    if (!sensorsOnline) {
        return false;
    }


    if (personDetected) {
        return false;
    }


    if (!doorClosed) {
        return false;
    }


    return true;

}


// ==================================================
// AUTOMATIC STERILIZATION
// ==================================================

function runAutomaticSterilization() {

    if (!systemStarted) {
        return;
    }


    const safe =
        safetyCheck();


    if (!safe) {

        sterilizationRunning =
            false;

        updateDashboard();

        return;

    }


    if (uvDose >= 100) {

        sterilizationRunning =
            false;

        cycleCompleted =
            true;

        updateDashboard();

        return;

    }


    if (!sterilizationRunning) {

        sterilizationRunning =
            true;

    }


    uvDose++;


    if (uvDose > 100) {
        uvDose = 100;
    }


    if (uvDose === 25) {

        addEvent(
            "UV-C dose reached 25%",
            "📈"
        );

    }


    if (uvDose === 50) {

        addEvent(
            "UV-C dose reached 50%",
            "📈"
        );

    }


    if (uvDose === 75) {

        addEvent(
            "UV-C dose reached 75%",
            "📈"
        );

    }


    if (uvDose === 100) {

        sterilizationRunning =
            false;

        cycleCompleted =
            true;


        addEvent(
            "UV-C dose target reached 100%",
            "✅"
        );


        addEvent(
            "OT is READY FOR SURGERY",
            "🏥"
        );


        completionSound();


        startSterilizationBtn.innerText =
            "🔄 START NEW CYCLE";


        startSterilizationBtn.disabled =
            false;


        systemStarted =
            false;

    }


    updateDashboard();

}


// ==================================================
// AUTOMATIC SAFETY EVENT
// ==================================================

function automaticSafetyEvent() {

    if (!systemStarted) {
        return;
    }


    if (cycleCompleted) {
        return;
    }


    if (safetyEventActive) {
        return;
    }


    const randomNumber =
        Math.random();


    if (randomNumber < 0.08) {

        safetyEventActive =
            true;


        if (Math.random() < 0.5) {

            personDetected =
                true;


            sterilizationRunning =
                false;


            addEvent(
                "PIR sensor: PERSON DETECTED",
                "🚨"
            );


            addEvent(
                "UV-C automatically stopped",
                "🛑"
            );


            startSafetyAlarm();

        }

        else {

            doorClosed =
                false;


            sterilizationRunning =
                false;


            addEvent(
                "Door sensor: DOOR OPENED",
                "🚪"
            );


            addEvent(
                "UV-C automatically stopped",
                "🛑"
            );


            startSafetyAlarm();

        }


        updateDashboard();


        setTimeout(
            clearSafetyEvent,
            5000
        );

    }

}


// ==================================================
// CLEAR SAFETY EVENT
// ==================================================

function clearSafetyEvent() {

    personDetected =
        false;


    doorClosed =
        true;


    safetyEventActive =
        false;


    addEvent(
        "Area clear and door closed",
        "🟢"
    );


    addEvent(
        "Automatic safety check passed",
        "🔍"
    );


    updateDashboard();

}


// ==================================================
// AUTOMATIC PROCESS FLOW
// ==================================================

function updateProcessFlow() {

    const safety =
        document.getElementById(
            "stepSafety"
        );


    const sterilize =
        document.getElementById(
            "stepSterilize"
        );


    const verify =
        document.getElementById(
            "stepVerify"
        );


    const ready =
        document.getElementById(
            "stepReady"
        );


    safety.className =
        "process-step";


    sterilize.className =
        "process-step";


    verify.className =
        "process-step";


    ready.className =
        "process-step";


    if (!systemStarted && !cycleCompleted) {

        safety.className =
            "process-step active";

        return;

    }


    if (
        personDetected ||
        !doorClosed
    ) {

        safety.className =
            "process-step active";

        return;

    }


    if (uvDose === 0) {

        safety.className =
            "process-step active";

        return;

    }


    if (
        uvDose > 0 &&
        uvDose < 100
    ) {

        safety.className =
            "process-step completed";


        sterilize.className =
            "process-step active";

        return;

    }


    if (
        uvDose >= 100 &&
        !cycleCompleted
    ) {

        safety.className =
            "process-step completed";


        sterilize.className =
            "process-step completed";


        verify.className =
            "process-step active";

        return;

    }


    if (cycleCompleted) {

        safety.className =
            "process-step completed";


        sterilize.className =
            "process-step completed";


        verify.className =
            "process-step completed";


        ready.className =
            "process-step active";

    }

}


// ==================================================
// UPDATE DASHBOARD
// ==================================================

function updateDashboard() {

    updateSensors();

    updateUV();

    updateAutomaticPanel();

    updateSafetyPanel();

    updateReadiness();

    updateOTStatus();

    updateGraph();

    updateProcessFlow();

}


// ==================================================
// SENSOR DISPLAY
// ==================================================

function updateSensors() {

    document.getElementById(
        "autoSensorStatus"
    ).innerText =
        "4 / 4 ONLINE";


    document.getElementById(
        "sensorNetworkStatus"
    ).innerText =
        "🟢 4 / 4 Online";


    const pir =
        document.getElementById(
            "pirStatus"
        );


    const autoPerson =
        document.getElementById(
            "autoPersonStatus"
        );


    if (personDetected) {

        pir.innerText =
            "🔴 PERSON DETECTED";


        autoPerson.innerText =
            "PERSON DETECTED";

    }

    else {

        pir.innerText =
            "🟢 Area Clear";


        autoPerson.innerText =
            "AREA CLEAR";

    }


    const door =
        document.getElementById(
            "doorStatus"
        );


    const autoDoor =
        document.getElementById(
            "autoDoorStatus"
        );


    if (doorClosed) {

        door.innerText =
            "🟢 Closed";


        autoDoor.innerText =
            "CLOSED";

    }

    else {

        door.innerText =
            "🔴 Open";


        autoDoor.innerText =
            "OPEN";

    }

}


// ==================================================
// UV DISPLAY
// ==================================================

function updateUV() {

    document.getElementById(
        "uvProgress"
    ).value =
        uvDose;


    document.getElementById(
        "uvValue"
    ).innerText =
        uvDose + "%";


    if (uvDose < 100) {

        if (systemStarted) {

            document.getElementById(
                "timeRemaining"
            ).innerText =
                Math.ceil(
                    (100 - uvDose) *
                    0.3
                ) + " sec";

        }

        else {

            document.getElementById(
                "timeRemaining"
            ).innerText =
                "30 sec";

        }

    }

    else {

        document.getElementById(
            "timeRemaining"
        ).innerText =
            "Completed";

    }


    const status =
        document.getElementById(
            "sterilizationStatus"
        );


    const badge =
        document.getElementById(
            "sterilizationBadge"
        );


    if (personDetected) {

        status.innerText =
            "Automatically Stopped";


        badge.innerText =
            "SAFETY STOP";

    }

    else if (!doorClosed) {

        status.innerText =
            "Waiting - Door Open";


        badge.innerText =
            "WAITING";

    }

    else if (uvDose >= 100) {

        status.innerText =
            "Sterilization Completed";


        badge.innerText =
            "COMPLETED";

    }

    else if (sterilizationRunning) {

        status.innerText =
            "Automatically Sterilizing";


        badge.innerText =
            "STERILIZING";

    }

    else if (!systemStarted) {

        status.innerText =
            "Waiting to Start";


        badge.innerText =
            "STANDBY";

    }

}


// ==================================================
// AUTOMATIC DECISION
// ==================================================

function updateAutomaticPanel() {

    const panel =
        document.getElementById(
            "automaticDecision"
        );


    const icon =
        document.getElementById(
            "decisionIcon"
        );


    const text =
        document.getElementById(
            "decisionText"
        );


    const description =
        document.getElementById(
            "decisionDescription"
        );


    const relay =
        document.getElementById(
            "relayState"
        );


    const personIcon =
        document.getElementById(
            "personCheckIcon"
        );


    const doorIcon =
        document.getElementById(
            "doorCheckIcon"
        );


    if (personDetected) {

        panel.className =
            "automatic-decision danger";


        icon.innerText =
            "🚨";


        text.innerText =
            "UV-C IMMEDIATELY STOPPED";


        description.innerText =
            "Person detected by automatic sensor.";


        relay.innerText =
            "AUTO OFF";


        personIcon.innerText =
            "!";


        return;

    }


    if (!doorClosed) {

        panel.className =
            "automatic-decision danger";


        icon.innerText =
            "🚪";


        text.innerText =
            "STERILIZATION BLOCKED";


        description.innerText =
            "Door sensor detected an open door.";


        relay.innerText =
            "AUTO OFF";


        doorIcon.innerText =
            "!";


        return;

    }


    if (uvDose >= 100) {

        panel.className =
            "automatic-decision safe";


        icon.innerText =
            "✅";


        text.innerText =
            "STERILIZATION COMPLETED";


        description.innerText =
            "Target UV-C dose achieved.";


        relay.innerText =
            "AUTO OFF";


        return;

    }


    if (!systemStarted) {

        panel.className =
            "automatic-decision safe";


        icon.innerText =
            "🟡";


        text.innerText =
            "WAITING FOR START";


        description.innerText =
            "Press START STERILIZATION to begin.";


        relay.innerText =
            "OFF";


        return;

    }


    panel.className =
        "automatic-decision safe";


    icon.innerText =
        "🟢";


    text.innerText =
        "STERILIZATION IN PROGRESS";


    description.innerText =
        "All safety conditions are satisfied.";


    relay.innerText =
        "AUTO ON";

}


// ==================================================
// SAFETY PANEL
// ==================================================

function updateSafetyPanel() {

    const badge =
        document.getElementById(
            "safetyBadge"
        );


    const alert =
        document.getElementById(
            "safetyAlert"
        );


    const pir =
        document.getElementById(
            "pirControlStatus"
        );


    const relay =
        document.getElementById(
            "relayStatus"
        );


    const lock =
        document.getElementById(
            "safetySystemStatus"
        );


    const alarm =
        document.getElementById(
            "alarmStatus"
        );


    if (personDetected) {

        badge.innerText =
            "DANGER";


        alert.className =
            "safety-alert danger";


        alert.innerHTML =
            "🚨 PERSON DETECTED<br>" +
            "UV-C automatically stopped.";


        pir.innerText =
            "🔴 DETECTED";


        relay.innerText =
            "🔴 AUTO OFF";


        lock.innerText =
            "🔴 LOCKED";


        if (soundEnabled) {

            alarm.innerText =
                "🔊 ALARM ACTIVE";

        }

    }

    else if (!doorClosed) {

        badge.innerText =
            "WARNING";


        alert.className =
            "safety-alert danger";


        alert.innerHTML =
            "🚪 DOOR OPEN<br>" +
            "UV-C automatically blocked.";


        pir.innerText =
            "🟢 CLEAR";


        relay.innerText =
            "🔴 AUTO OFF";


        lock.innerText =
            "🟡 WAITING";


        if (soundEnabled) {

            alarm.innerText =
                "🔊 ALARM ACTIVE";

        }

    }

    else {

        badge.innerText =
            "SAFE";


        alert.className =
            "safety-alert safe";


        alert.innerHTML =
            "🟢 AREA CLEAR<br>" +
            "Automatic safety monitoring is active.";


        pir.innerText =
            "🟢 CLEAR";


        relay.innerText =
            sterilizationRunning
                ? "🟢 AUTO ON"
                : "🟡 STANDBY";


        lock.innerText =
            "🟢 ACTIVE";


        alarm.innerText =
            "🔇 SILENT";

    }

}


// ==================================================
// READINESS
// ==================================================

function updateReadiness() {

    let score = 0;


    if (uvDose >= 100) {

        score += 40;

        document.getElementById(
            "doseCheck"
        ).innerHTML =
            "✅ UV-C Dose Completed";

    }

    else {

        document.getElementById(
            "doseCheck"
        ).innerHTML =
            "❌ UV-C Dose Not Completed";

    }


    if (doorClosed) {

        score += 20;

        document.getElementById(
            "doorCheck"
        ).innerHTML =
            "✅ Door Closed";

    }

    else {

        document.getElementById(
            "doorCheck"
        ).innerHTML =
            "❌ Door Open";

    }


    if (!personDetected) {

        score += 20;

        document.getElementById(
            "personCheck"
        ).innerHTML =
            "✅ No Person Detected";

    }

    else {

        document.getElementById(
            "personCheck"
        ).innerHTML =
            "❌ Person Detected";

    }


    if (sensorsOnline) {

        score += 20;

        document.getElementById(
            "sensorCheck"
        ).innerHTML =
            "✅ Sensors Online";

    }


    document.getElementById(
        "readinessScore"
    ).innerText =
        score + "%";


    if (
        uvDose >= 100 &&
        doorClosed &&
        !personDetected &&
        sensorsOnline
    ) {

        document.getElementById(
            "readinessStatus"
        ).innerText =
            "READY FOR SURGERY";


        document.getElementById(
            "readinessStatus"
        ).style.color =
            "#087443";

    }

    else {

        document.getElementById(
            "readinessStatus"
        ).innerText =
            "NOT READY";


        document.getElementById(
            "readinessStatus"
        ).style.color =
            "#c8511e";

    }

}


// ==================================================
// OT STATUS
// ==================================================

function updateOTStatus() {

    const bar =
        document.getElementById(
            "otStatusBar"
        );


    const status =
        document.getElementById(
            "otStatus"
        );


    const message =
        document.getElementById(
            "statusMessage"
        );


    if (personDetected) {

        status.innerText =
            "🚨 SAFETY ALERT";


        message.innerText =
            "Person detected. UV-C automatically stopped.";


        bar.className =
            "ot-status danger";

        return;

    }


    if (!doorClosed) {

        status.innerText =
            "🚪 DOOR OPEN";


        message.innerText =
            "UV-C sterilization automatically blocked.";


        bar.className =
            "ot-status danger";

        return;

    }


    if (uvDose >= 100) {

        status.innerText =
            "✓ READY FOR SURGERY";


        message.innerText =
            "Sterilization completed successfully.";


        bar.className =
            "ot-status ready";

        return;

    }


    if (sterilizationRunning) {

        status.innerText =
            "☀️ AUTOMATIC STERILIZATION";


        message.innerText =
            "UV-C sterilization is running automatically.";


        bar.className =
            "ot-status";

        return;

    }


    status.innerText =
        "🤖 WAITING TO START";


    message.innerText =
        "Press START STERILIZATION to begin the process.";


    bar.className =
        "ot-status";

}


// ==================================================
// GRAPH
// ==================================================

function updateGraph() {

    const time =
        new Date()
        .toLocaleTimeString();


    uvChart.data.labels.push(
        time
    );


    uvChart.data.datasets[0]
        .data.push(uvDose);


    if (
        uvChart.data.labels.length > 30
    ) {

        uvChart.data.labels.shift();

        uvChart.data.datasets[0]
            .data.shift();

    }


    uvChart.update();

}


// ==================================================
// INITIAL EVENTS
// ==================================================

addEvent(
    "Dashboard initialized",
    "🤖"
);


addEvent(
    "Automatic mode activated",
    "🟢"
);


addEvent(
    "UV-C sensors connected: 4/4",
    "📡"
);


addEvent(
    "Automatic safety monitoring started",
    "🔍"
);


addEvent(
    "Waiting for START button",
    "▶️"
);


// ==================================================
// AUTOMATIC TIMERS
// ==================================================

// 1% every 300 milliseconds
// 100% = approximately 30 seconds

setInterval(
    runAutomaticSterilization,
    300
);


// Sensor values

setInterval(
    generateSensorData,
    3000
);


// Safety event monitoring

setInterval(
    automaticSafetyEvent,
    3000
);


// Initial display

generateSensorData();

updateDashboard();
