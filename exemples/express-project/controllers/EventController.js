const mysql = require('mysql')
const pool = require("./db")
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const utils = require("./utils/ics_utils");
const ical = require("ical");
const fs = require("fs");
const Event = require(__dirname + "/func/event_func.js");

/* GET event listing in SQL base (event from emploi_du_temps) */
function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
}

exports.insert_edt = asyncHandler (async (req, res, next) => {
    let url = req.body.url;
    Event.get_edt(url, ical, function(err, result)
    {
        let data = [...result];
        Event.insert_all_events(result, req.session.id_ens, function(err, result)
        {
            if(err) throw err;
            console.log("Insert edt terminer");
            res.send({code: 1, data: data});
        })
    })
})

exports.get_edt = asyncHandler(async (req, res, next) => {
    let id = req.session.id_ens;
    Event.get_events_by_enseignant_id(id, function(err, result) {
        res.send(result);
    })
});

// liste tout les évenements
exports.event_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

// information pour un evénement
exports.event_detail = asyncHandler(async (req, res, next) => {
    
    res.send(`NOT IMPLEMENTED: event detail: ${req.params.id}`);
});

// Créer un evénement sur GET
exports.event_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event create GET");
});

// Supprime un evénement sur GET
exports.event_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event delete GET");
});

// Modifie un evénement sur GET
exports.event_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event update GET");
});