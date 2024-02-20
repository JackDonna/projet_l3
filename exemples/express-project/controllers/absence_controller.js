const asyncHandler = require("express-async-handler");
const {RequestResponse} = require("./utils/object_engine");
const express = require("express");
const
    {
        insert_new_absence,
        get_available_teacher,
        get_absence
    } = require(__dirname + "/cruds/crud_absence.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function ajout_absence post request to insert new absence in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_absence = asyncHandler( (req, res) => {
    insert_new_absence(req, res, (err, result) =>
    {
        let response = new RequestResponse
        (
            "absenceAPI",
            "POST",
            result,
            "boolean",
            "put a timetable insto the database",
            err
        );

        if(err) console.error(err);
        res.send(response);
    });
})


/**
 * @function available_teacher get request to get the teachers available in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_teacher = asyncHandler( (req, res) => {
    get_available_teacher(req, res, (err, result) =>
    {
        let response = new RequestResponse
        (
            "absenceAPI",
            "GET",
            result,
            "<teacherCollection>",
            "get all teacher avaible with filter",
            err
        );

        if(err) console.error(err);
        res.send(response);
    });
})

/**
 * @function avaible_absence get request to send the avaible absence, only for admin
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_absence = asyncHandler((req, res) => 
{
    get_absence(req, res, (err, result) =>
    {
        let response = new RequestResponse
        (
            "absenceAPI",
            "GET",
            result,
            "<absenceCollection>",
            "get absence avaible for admin only",
            err
        );

        if(err) console.error(err);
        res.send(response);
    })
})

// exports.list_absence = asyncHandler(async (req, res, next) => {
//     let d_debut = req.params.debut
//     let d_fin = req.params.fin
//
//     Absence.select_all_absence_beewtween_two_dates(d_debut, d_fin, function(err, result){
//         res.send(result)
//     })
// })
