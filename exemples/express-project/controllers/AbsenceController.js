const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const db = require("./db")
const Absence = require(__dirname + "/func/absence.js")

exports.list_absence = asyncHandler(async (req, res, next) => {
    let d_debut = req.params.debut
    let d_fin = req.params.fin

    Absence.select_all_absence_beewtween_two_dates(d_debut, d_fin, function(err, result){
        res.send(result)
    })
})

exports.ajout_absence = asyncHandler(async (req, res, next) => {
    let d_debut = req.params.debut
    let d_fin = req.params.fin
    let classe = req.params.classe
    let salle = req.params.salle
    let motif = req.params.motif

    Absence.get_event_by_date_and_classroom(d_debut, d_fin, classe, salle, function(err, result){
        Absence.insert_absence(motif, result.id_ev, function(err, result){
            if(err) console.err(err)
        })
    })
})