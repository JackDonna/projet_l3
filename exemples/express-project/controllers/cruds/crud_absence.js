const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------ //
/**
 * function insert an absence in the sql database
 * @param motif {string} reason of the absence
 * @param id_event {int} id of the event
 * @param callback {function} callback function (err, result)
 */
function insert_absence(motif, id_event, callback)
{
    pool.getConnection((err, db) =>
    {
        if(err) callback(err, null)
        db.query(
            {
                sql: SQL.insert.absence,
                timeout: 10000,
                values: [motif, id_event]
            },
            (err, rows, fields) => {
                if (err) callback(err, null)
                callback(null, true)
            })
    })
}

/**
 * function get list of teacher in sql database
 * @param debut {datetime} begining of the event
 * @param fin {datetime} end of the event
 * @param callback {function} callback function (err, result)
 */
function prof_dispo(debut, fin, callback)
{
    pool.getConnection((err, db) =>
    {
        if(err) callback(err,null);
        db.query(
            {
                sql: SQL.select.available_teacher,
                timeout: 10000,
                values: [debut, fin, debut, fin]
            },
            (err, rows, fields) => {
                if (err) callback(err, null)
                callback(null, rows)
            })
    })
}

// --------------------------------------- NOT IMPLEMENTED YET ----------------------------------------- //
/**
 * function insert a new absence with the router parameters
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function insert_new_absence(req, res, callback)
{
    insert_absence(req.body.motif, req.body.id_event, (err, result) =>
    {
        if(err) callback(err, null);
        callback(null, true);
    })
}

/**
 * function get the list of teacher with router parameters
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function get_available_teacher(req, res, callback)
{
    prof_dispo(req.params.debut, req.params.fin, (err, result) =>
    {
        if(err) callback(err, null);
        callback(null, result);
    })
}

// --------------------------------------------------- EXPORTS ------------------------------------------------------ //
module.exports = {insert_new_absence, get_available_teacher}

// exports.select_all_absence_beewtween_two_dates = (d_debut, d_fin, callback) =>
// {
//     db.query(
//         {
//             sql: SQL.sql.all_absence_beetween_two_dates,
//             timeout: 10000,
//             values: [d_debut, d_fin]
//         },
//         (err, rows, fields) => {
//             if(err) callback(err, null);
//             let obj = []
//
//             for(let i in rows){
//                 Event.select_discipline_by_id(rows[i].discipline, function(err, result){
//                     obj.push({
//                         'id_abs' : rows[i].id_abs,
//                         'motif' : rows[i].motif,
//                         'discipline' : discipline,
//                         'niveau': rows[i].niveau,
//                         'classe': rows[i].classe,
//                         'salle': rows[i].salle,
//                         'heure_debut': rows[i].heure_debut,
//                         'heure_fin': rows[i].heure_fin
//                     })
//                 })
//             }
//             callback(null, obj);
//         }
//     )
// }
//
// exports.get_event_by_date_and_classroom = (heure_debut, heure_fin, classe, salle, callback) =>
// {
//     db.query(
//         {
//             sql: SQL.sql.select.event_by_date_and_classroom,
//             timeout: 10000,
//             values: [heure_debut, heure_fin, classe, salle]
//         },
//         (err, rows, fields) => {
//             if(err) console.err(err);
//             Event.select_discipline_by_id(rows[0].discipline, function(err, result){
//                 let obj = {
//                     'id_ev' : rows[0].id_ev,
//                     'discipline' : result,
//                     'niveau' : rows[0].niveau,
//                     'classe': rows[0].classe,
//                     'salle': rows[0].salle,
//                     'heure_debut': rows[0].heure_debut,
//                     'heure_fin': rows[0].heure_fin,
//                     'enseignant': rows[0].enseignant
//                 }
//                 callback(null, obj)
//             })
//         })
// }