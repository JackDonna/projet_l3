const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const express = require("express");
const { getAvailableTeacherByDisc } = require("./cruds/crud_absence");
const { insert_new_absence, getAvailableTeacher, get_absence, teacher_available_by_courses } = require(__dirname +
    "/cruds/crud_absence.js");
const { get_event_by_id, all_teachers_available } = require(__dirname + "/cruds/crud_event.js");

const { get_all_teacher } = require(__dirname + "/cruds/crud_teacher.js");
const { insert_all_diffusion } = require(__dirname + "/cruds/crud_diffusion.js");
const { isAuthenticated } = require(__dirname + "/utils/session.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function ajout_absence post request to insert new absence in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_absence = asyncHandler((req, res) => {
    if (!isAuthenticated(req)) {
        console.log(
            "\u001b[" +
                31 +
                "m" +
                `[INSERT ABSENCE - SECURITY BREACH : "${
                    req.ip
                }" - (${new Date().toLocaleString()}) - NOT CONNECTED / REFUSED ACCESS]` +
                "\u001b[0m"
        );
        return;
    }
    insert_new_absence(req, res, (err, result) => {
        let response = new RequestResponse("absenceAPI", "POST", result, "boolean", "put a timetable insto the database", err);

        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * @function available_teacher get request to get the teachers available in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_teacher = asyncHandler((req, res) => {
    getAvailableTeacher(req, res, (err, result) => {
        let response = new RequestResponse(
            "absenceAPI",
            "GET",
            result,
            "<teacherCollection>",
            "get all teacher avaible with filter",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * @function avaible_absence get request to send the avaible absence, only for admin
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_absence = asyncHandler((req, res) => {
    if (!isAuthenticated(req)) {
        console.log(
            "\u001b[" +
                31 +
                "m" +
                `[AVAILABLE ABSENCE - SECURITY BREACH : "${
                    req.ip
                }" - (${new Date().toLocaleString()}) - NOT CONNECTED / REFUSED ACCESS]` +
                "\u001b[0m"
        );
        return;
    }
    get_absence(req, res, (err, result) => {
        let response = new RequestResponse(
            "absenceAPI",
            "GET",
            result,
            "<absenceCollection>",
            "get absence avaible for admin only",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
});

// exports.list_absence = asyncHandler(async (req, res, next) => {
//     let d_debut = req.params.debut
//     let d_fin = req.params.fin
//
//     Absence.select_all_absence_beewtween_two_dates(d_debut, d_fin, function(err, result){
//         res.send(result)
//     })
// })

function idInResult(element, array) {
    for (let value of array) {
        if (value.id == element) {
            return true;
        }
    }
    return false;
}
function intersect(a, b) {
    let res = [];
    a.forEach((value) => {
        if (idInResult(value.id, b)) res.push(value);
    });
    return res;
}

exports.filterAbsence = asyncHandler((req, res) => {
    if (!isAuthenticated(req)) {
        console.log(
            "\u001b[" +
                31 +
                "m" +
                `[FILTRAGE - SECURITY BREACH : "${
                    req.ip
                }" - (${new Date().toLocaleString()}) - NOT CONNECTED / REFUSED ACCESS]` +
                "\u001b[0m"
        );
        return;
    }
    let id = req.body.ev.id;
    let date = new Date(req.body.ev.start).toLocaleDateString("sv-SE");
    let start = new Date(req.body.ev.start).toLocaleTimeString();
    let end = new Date(req.body.ev.end).toLocaleTimeString();

    getAvailableTeacher(date, start, end, (err, scheduleResult) => {
        getAvailableTeacherByDisc(id, (err, disciplineResult) => {
            let result = intersect(scheduleResult, disciplineResult);
            insert_all_diffusion(result, id, (err, result) => {
                console.log(
                    "\u001b[" +
                        32 +
                        "m" +
                        `[FILTRAGE - OK : ${
                            req.session.id_ens
                        } - ${new Date().toLocaleString()} - WORK FINE | ACCESS GRANTED]` +
                        "\u001b[0m"
                );
                res.send("ok");
            });
        });
    });
});
