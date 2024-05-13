// ----------------------------------------------------------------------------------------------------------------------------//
// --- DOM ELEMENTS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const calendarElement = document.getElementById("calendar");
const reader = document.getElementById("scan_code");
const scanButton = document.getElementById("scan_qr_code");
const closeScanner = document.getElementById("closeScanner");

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS --------------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

/**
 * Formats the given time into a string in the format "HH:MM".
 *
 * @param {Date} time - The time to be formatted.
 * @return {string} The formatted time string.
 */
const formatTime = (time) =>  {
    let hour = time.getHours();
    let minute = time.getMinutes()
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    return hour + ":" + minute;
}

/**
 * Handles the success of scanning a QR code.
 *
 * @param {string} QRCodeResult - The result of scanning the QR code.
 * @return {void} This function does not return a value.
 */
const QRCodeScannerSucces = (QRCodeResult) => {
    scanner.clear();
    reader.classList.add("hide");
    axios
        .post("sql/event/insert_timetable", {
            url: QRCodeResult
        }, {
            timeout: 6000000,
    })
        .then((response) => {
            get_timetable();
            loading.classList.add("hide");
        });
}

/**
 * Handles the error that occurs during QR code scanning.
 *
 * @param {string} QRCodeError - The error message related to QR code scanning.
 * @return {void}
 */
const QRCodeScannerError = (QRCodeError) => {
    console.error(QRCodeError);
}

/**
 * Resizes the QR box based on the viewfinder dimensions.
 *
 * @param {number} viewfinderWidth - The width of the viewfinder.
 * @param {number} viewfinderHeight - The height of the viewfinder.
 * @return {Object} An object containing the resized width and height of the QR box.
 */
const QRBoxResize = (viewfinderWidth, viewfinderHeight) => {
    let minEdgePercentage = 0.7;
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
}

/**
 * Retrieves the timetable from the server and adds the events to the calendar.
 *
 * @return {void} This function does not return a value.
 */
const getTimeTable = () => {
    axios.get("sql/event/get_timetable").then((response) => {
        for (let event of response.data) {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            ec.addEvent(event);
        }
    });
}
 
/**
 * Resizes the calendar based on the window's inner width.
 *
 * @return {void} This function does not return a value.
 */
const resizeCalendar = () => {
    if (window.innerWidth < 800) {
        ec.setOption("view", "timeGridDay");
    } else {
        ec.setOption("view", "timeGridWeek");
    }
}

// ----------------------------------------------------------------------------------------------------------------------------//
// ----CONSTANTS VARIABLES ----------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const scanner = new Html5QrcodeScanner("reader", {
    qrbox: QRBoxResize,
    fps: 60,
});

const ec = new EventCalendar(calendarElement, {
    view: "timeGridWeek",
    events: [],
    locale: "fr",
    firstDay: 1,
    slotMinTime: "06:00:00",
    slotMaxTime: "21:00:00",
});

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

getTimeTable();

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTES LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

scanButton.addEventListener("click", () => {
    scanner.render(QRCodeScannerSucces, QRCodeScannerError);
    reader.classList.remove("hide");
});

closeScanner.addEventListener("click", () => {
    scanner.clear();
    reader.classList.add("hide");
});

close_form.addEventListener("click", () => {
    absence_form.classList.add("hide");
});


