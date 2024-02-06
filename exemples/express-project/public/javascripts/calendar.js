/**
 * All imports -----------------------------------------------------
 * @var axios is from axios.js import CDN
 */
/**
 * @var EventCalendar is from EventCalendar.js CDN import
 */
/**
 * @var Html5QrcodeScanner is from Html5QrcodeScanner CDN import
 */
/** All method use by import ----------------------------------------
 * @method EventCalendar.addEvent add event to the calendar, take an object
 */
/**
 * @method EventCalendar.setOption set option after declaration of calendar
 */

// DOM element to display result of qr code
let result_element = document.querySelector("#result");
// Dom element to display calendar
let calendar_element = document.getElementById('calendar');
// Object calendar
let ec = new EventCalendar(calendar_element, {
    view: 'timeGridWeek',
    events: [],
    locale: "fr",
    firstDay: 1,
    slotMinTime: "06:00:00",
    slotMaxTime: "21:00:00",
});
let s = new Date();
let c = new Date();
window.addEventListener('resize', () => {
    if (window.innerWidth < 800) {
        ec.setOption("view", "timeGridDay");
    }
    else {
        ec.setOption("view", "timeGridWeek");
    }
});
let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; // 70%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize
    };
}
const scanner = new Html5QrcodeScanner('reader', {
    // Scanner will be initialized in DOM inside element with id of 'reader'
    qrbox : qrboxFunction, // Sets dimensions of scanning box (set relative to reader element width)
    fps: 60, // Frames per second to attempt a scan
});


scanner.render(success, error);
// Starts scanner

function success(result) {
    let obj = {
        "url": result
    }
    scanner.clear();
    reader.classList.add("hide");
    // Clears scanning instance

    document.getElementById('reader').remove();

    // Fetching potential icals data from qr code to API
    axios.post("/sql/event/insert_edt", obj).then(function(response)
    {
        console.log(response.data);
        // Fail code = 0
        if(response.data.code === 0)
        {
            result_element.innerHTML = "L'url ou le QR code ne corresponde pas à un EDT valide."
        }
        // Succes, api render data from object {ressponse.data = {"code": int, "data" : object}
        else
        {
            result_element.innerHTML = "Votre EDT à bien été lu et enregistré.";
            for(let event of response.data.data)
            {
                ec.addEvent(event);
            }
        }
    })
    // Prints result as a link inside result element

    // Removes reader element from DOM since no longer needed

}
function error(err) {
    //console.error(err);
    // Prints any errors to the console
}

let reader = document.getElementById("scan_code");
let scan_button = document.getElementById("scan_qr_code");
let close_scanner = document.getElementById("close_scanner");
let render_region = document.getElementById("reader__scan_region");
scan_button.addEventListener("click", () => {
    reader.classList.remove("hide");
})
close_scanner.addEventListener("click", () => {
    reader.classList.add("hide");
})

axios.get("/sql/event/get_edt").then((response) => {
    console.log(response.data);
    for(let event of response.data)
    {
        console.log(event)
        ec.addEvent(event);
    }
})

