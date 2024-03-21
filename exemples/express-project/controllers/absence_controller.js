const asyncHandler = require("express-async-handler");
const {RequestResponse} = require("./utils/object_engine");
const express = require("express");
const
    {
        insert_new_absence,
        get_available_teacher,
        get_absence,
        teacher_available_by_courses,
    } = require(__dirname + "/cruds/crud_absence.js");
const
    {
        get_event_by_id,
        all_teachers_available,
    } = require(__dirname + "/cruds/crud_event.js");

const
    {
        get_all_teacher,
    } = require(__dirname + "/cruds/crud_teacher.js");
const
    {
        insert_all_diffusion,
    } = require(__dirname + "/cruds/crud_diffusion.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function ajout_absence post request to insert new absence in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_absence = asyncHandler((req, res) => {
    insert_new_absence(req, res, (err, result) => {
        let response = new RequestResponse
        (
            "absenceAPI",
            "POST",
            result,
            "boolean",
            "put a timetable insto the database",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
})


/**
 * @function available_teacher get request to get the teachers available in the sql database
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_teacher = asyncHandler((req, res) => {
    get_available_teacher(req, res, (err, result) => {
        let response = new RequestResponse
        (
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
})
/**
 * @function avaible_absence get request to send the avaible absence, only for admin
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.available_absence = asyncHandler((req, res) => {
    get_absence(req, res, (err, result) => {
        let response = new RequestResponse
        (
            "absenceAPI",
            "GET",
            result,
            "<absenceCollection>",
            "get absence avaible for admin only",
            err
        );

        if (err) console.error(err);
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


exports.filtre_diffusion = asyncHandler ((req, res) => {
    let id_event = req.body.id_ev;
    get_event_by_id(id_event,(err,result) => {
        let hdebut = result[0].heure_debut;
        let hfin = result[0].heure_fin;
        let date = result[0].date;


    // Créer un objet Date en utilisant la chaîne de date
        var dateObj = new Date(date);

    // Extraire la date (année, mois, jour)
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth() + 1; // Les mois sont indexés à partir de 0
        var day = dateObj.getDate();

    // Formater la date au format "YYYY-MM-DD"
        var formattedDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

        date = formattedDate;

        get_all_teacher((err, teachers) => {
            if (err) console.error(err);
            console.log("tout les pof recuperer")
            //console.log(result);
            all_teachers_available(teachers,hdebut,hfin,date,(err,available) => {
                console.log("trie par horaire fini")
                if (err) console.error(err);
                //console.log(result);
                teacher_available_by_courses(id_event,available,(err, courses) => {

                    if (err) console.error(err);
                    console.log("trie par matière fini")
                    insert_all_diffusion(courses, id_event, (err, result) => { // à Changer
                        console.log("insertion des diffusion fini")
                        if (err) console.error(err);
                        res.send("ok");
                    })
                })
            })
        })
    })
});
