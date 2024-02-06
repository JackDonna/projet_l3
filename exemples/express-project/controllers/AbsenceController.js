const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const db = require("./db")
const Absence = require(__dirname + "/func/absence_func.js")

exports.list_absence = asyncHandler(async (req, res, next) => {
    let d_debut = req.params.debut
    let d_fin = req.params.fin

    Absence.select_all_absence_beewtween_two_dates(d_debut, d_fin, function(err, result){
        res.send(result)
    })
})

exports.ajout_absence = asyncHandler(async (req, res, next) => {
    Absence.insert_absence(req.params.motif, req.params.id_event, function(err, result){
        if(err) console.err(err)
    })
})