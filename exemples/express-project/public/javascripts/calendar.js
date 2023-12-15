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

// DOM element to display result of qr code
let result_element = document.querySelector("#result");
// Dom element to display calendar
let calendar_element = document.getElementById('calendar');
// Object calendar
let ec = new EventCalendar(calendar_element, {
    view: 'timeGridWeek',
    events: [],
    locale: "fr",
    firstDay: 1
});

const scanner = new Html5QrcodeScanner('reader', {
    // Scanner will be initialized in DOM inside element with id of 'reader'
    qrbox: {
        width: 250,
        height: 250,
    },  // Sets dimensions of scanning box (set relative to reader element width)
    fps: 20, // Frames per second to attempt a scan
});


scanner.render(success, error);
// Starts scanner

function success(result) {
    let obj = {
        "url": result
    }

    // Fetching potential icals data from qr code to API
    axios.post("/api/download", obj).then(function(response)
    {
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
    scanner.clear();
    // Clears scanning instance

    document.getElementById('reader').remove();
    // Removes reader element from DOM since no longer needed

}
function error(err) {
    //console.error(err);
    // Prints any errors to the console
}
