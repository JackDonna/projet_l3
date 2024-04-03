// ----------------------------------------------------------------------------------------------------------------------------//
// --- DOM ELEMENTS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const result_element = document.querySelector("#result");
const calendar_element = document.getElementById("calendar");
const absence_form = document.getElementById("add_absence");
const reader = document.getElementById("scan_code");
const scan_button = document.getElementById("scan_qr_code");
const close_scanner = document.getElementById("close_scanner");
const render_region = document.getElementById("reader__scan_region");
const loading = document.querySelector(".loading");
const start_absence = absence_form.querySelector(".start_absence");
const end_absence = absence_form.querySelector(".end_absence");
const reason = absence_form.querySelector(".reason");
const submit = absence_form.querySelector(".submit_form");
const close_form = absence_form.querySelector("#close_form");

// ----------------------------------------------------------------------------------------------------------------------------//
// ----GLOBALS VARIABLES ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

axios
    .post(
        "sql/event/insert_timetable",
        {
            url: "https://0730013t.index-education.net/pronote/ical/Edt.ics?icalsecurise=47288A3362A404BCDD6B830DC6A64F10B36EA021148F1C832CE902E67FA9BBE2CF2E8D98EABC9ACE5A48D48C26F23F7E&version=2023.0.2.7&param=66683d31",
        },
        {
            onDownloadProgress: (progressEvent) => {
                const dataChunk = progressEvent;
                console.log(dataChunk.event);
            },
            timeout: 6000000,
        }
    )
    .then((response) => {
        get_timetable();
    });

const scanner = new Html5QrcodeScanner("reader", {
    qrbox: qrboxFunction,
    fps: 60,
});

const ec = new EventCalendar(calendar_element, {
    view: "timeGridWeek",
    events: [],
    locale: "fr",
    firstDay: 1,
    slotMinTime: "06:00:00",
    slotMaxTime: "21:00:00",
    eventClick: function (info) {
        absence_form.classList.remove("hide");
        start_absence.value = format_time(info.event.start);
        end_absence.value = format_time(info.event.end);
        global_event = info.event;
    },
});

var global_event = {};

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS --------------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

/**
 * format a time to display it in time fields form
 * @param {Date} time base date to extract hour in it
 * @return {string} formatted date
 */
function format_time(time) {
    let hour = time.getHours();
    hour < 10 ? (hour = "0" + hour) : null;

    let minute = time.getMinutes();
    minute < 10 ? (minute = "0" + minute) : null;
    return hour + ":" + minute;
}

/**
 * function handle sucess of qr code scanning
 * @param {string} result link of the qr code
 */
function success(result) {
    let obj = {
        url: result,
    };
    scanner.clear();
    reader.classList.add("hide");
    document.getElementById("reader").remove();
    loading.classList.remove("hide");

    axios
        .post("sql/event/insert_timetable", obj, {
            onDownloadProgress: (progressEvent) => {
                const dataChunk = progressEvent;
                console.log(dataChunk.event);
            },
            timeout: 6000000,
        })
        .then((response) => {
            get_timetable();
        });
}

/**
 * function hancle qr code scan error
 * @param {Error} err
 */
function error(err) {
    console.error(err);
}

/**
 * function set the qr code GUI, need to call whene initialize the qrcode
 * @param {number} viewfinderWidth
 * @param {number} viewfinderHeight
 * @returns
 */
function qrboxFunction(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; // 70%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
}

/**
 * A JavaScript function that fetches timetable from the server and adds each returned event to the EventCalendar instance `ec`
 *
 * This function makes a GET request to the "/sql/event/get_timetable" endpoint using axios.
 * Upon successful request, the function logs the data from the response and adds each event from the response data to the calendar.
 *
 * The function does not take any parameters and does not explicitly return anything.
 *
 * Note: This function uses the EventCalendar instance `ec` which should be defined before calling this function.
 */

/**
 * get the timtable to RDP API
 */
function get_timetable() {
    axios.get("sql/event/get_timetable").then((response) => {
        for (let event of response.data) {
            ec.addEvent(event);
        }
    });
}

/**
 * resize calendar with the current window size
 */
function resize_calendar() {
    if (window.innerWidth < 800) {
        ec.setOption("view", "timeGridDay");
    } else {
        ec.setOption("view", "timeGridWeek");
    }
}

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

get_timetable();
scanner.render(success, error);

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTES LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

scan_button.addEventListener("click", () => {
    reader.classList.remove("hide");
});
close_scanner.addEventListener("click", () => {
    reader.classList.add("hide");
});

submit.addEventListener("click", function () {
    axios.post("sql/absence/insert/", { id_event: global_event.id, motif: reason.value }).then((response) => {
        axios.post("sql/absence/filtre/", { ev: global_event }).then((response) => {
            console.log(response.data);
        });
    });
});

close_form.addEventListener("click", () => {
    absence_form.classList.add("hide");
});

window.onload((e) => {
    resize_calendar();
});

window.onresize((e) => {
    resize_calendar();
});
