const pool = require("../database/db.js");
const axios = require("axios");
const utils = require("../utils/ics_utils");
const fs = require("fs");
const ical = require("ical");
const config = JSON.parse(fs.readFileSync("controllers/utils/color_config.json", 'utf8'));
const colors = config.colors;
const sql_config = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_config.sql;


// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------ //
/**
 * function build a Javascript Object for an event, handle the color of the event too.
 * @param title {string} title of the event
 * @param start {date} start date of the event
 * @param end {date} end date of the event
 * @param location {string} location of the event
 * @param id {int} id of the event (database link)
 * @param classe {string} classe (classe name of the event)
 * @param salle salle (classroom name of the event)
 * @returns {{any}} final built-in JS object
 */
function build_event(title, start, end, location, id, classe, salle)
{
    let event =
        {
            title: title,
            start: start,
            end: end,
            location: location,
            id: id,
            classe: classe,
            salle: salle
        }
    event.backgroundColor = "#08CFFB"
    for (let color of colors)
    {
        if(title.toLowerCase().includes(color.name.toLowerCase()) || color.name.toLowerCase().includes(title.toLowerCase())) {
            event.backgroundColor = color.color
        }
    }
    return event;
}

/**
 * function send a query to the database to insert discipline entities in herself
 * @param db
 * @param discipline {string} discipline name
 * @param callback {function} callback function (err, result)
 */
function insert_discipline(db, discipline, callback)
{
    db.query(
        {
            sql: SQL.insert.discipline,
            timeout: 10000,
            values: [discipline]
        },
        (err, rows, fields) => {
            if(err) callback(err, null);
            callback(null, true);
        })
}

/**
 * function select discipline entitie by query the database with her name in parameters
 * @param db
 * @param discipline {string} discipline name
 * @param callback {function} callback function (err, result)
 */
function select_discipline_by_name(db, discipline, callback)
{
    db.query(
        {
            sql: SQL.select.discipline_by_name,
            timeout: 10000,
            values: [discipline]
        },
        (err, rows, fields) => {
            if(err) callback(err, null);
            callback(null, rows[0]);
        })
}

/**
 * function select discipline entitie by query the database with her id in parameters
 * @param id_discipline {int} discipline id
 * @param callback {function} callback function (err, result)
 */
function select_discipline_by_id(id_discipline, callback)
{
    pool.getConnection((err, db) =>
    {
        if(err) callback(err, null)
        db.query(
            {

                sql: SQL.select.discipline_by_name,
                timeout: 10000,
                values: [id_discipline]
            },
            (err, rows, fields) => {
                if(err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}

/**
 * function insert an event in the database with all required parameters
 * @param db db pool connection
 * @param discipline {string} discipline name
 * @param niveau {string} level of the classroom
 * @param classe {string} name of the classroom
 * @param salle {string} the classroom
 * @param date {string} date of the event
 * @param start {Date} start date of the event
 * @param end {Date} end date of the event
 * @param enseignant {int} id of the teacher (user) who own this event
 * @param callback {function} callback function (err, result)
 */
function insert_event(db, discipline, niveau, classe, salle, date, start, end, enseignant, callback)
{
    console.log("insertion d'un event, recherche de la discipline ! " + discipline + "\n");
    console.log([niveau, classe, salle, date, start, end, enseignant])
    insert_discipline(db, discipline, (err, result) =>
    {
        if(err) callback(err,null)
        select_discipline_by_name(db, discipline, function(err, result)
        {
            console.log(result.id_disc + " l'id de la discipline")
            if(err) callback(err, null);
            db.query(
                {
                    sql: SQL.insert.evenement,
                    timeout: 10000,
                    values: [result.id_disc, niveau, classe, salle, date, start, end, enseignant]
                },
                (err, rows, fields) => {
                    if(err) callback(err, null);
                    callback(null, true);
                })
        })
    })
}

/**
 * function get the timetable with the given link and parse it in JS readable object
 * @param link {string} the given link
 * @param callback {function} callback function (err, result)
 */
function parse_edt(link, callback)
{
    axios.get(link,
        {
            responseType : 'blob'
        }).then((response) => {
        let data = utils.parseICSURL(response.data, ical);
        callback(null, data);
    })
}

/**
 * function insert a collection of given events in the database by severals db querys
 * @param events {array} collection of events
 * @param id {int} teacher id (found in current session)
 * @param callback {function} callback function (err, result)
 */
function insert_all_events(events, id, callback)
{
    pool.getConnection((err, db) => {
        for (let event of events) {
            let start_houre = new Date(event.start);
            start_houre.setHours(start_houre.getHours() + 1);
            end_houre.setHours(end_houre.getHours() + 1);
            let end_houre = new Date(event.end);
            let formatted_date = new Date(event.start).toISOString().split('T')[0];
            start_houre = (start_houre.toISOString().split('T')[0] + " " + start_houre.toISOString().split('T')[1]).split("Z")[0];
            end_houre = (end_houre.toISOString().split('T')[0] + " " + end_houre.toISOString().split('T')[1]).split("Z")[0];
            let salle = "none";
            let classe = "none";
            let niveau = "none";
            try {
                salle = event.description.val.split('Salle : ')[1];
                salle = salle.split('\n')[0];
            } catch {
                null
            }
            try {
                classe = event.description.val.split('Classe : ')[1];
                classe = classe.split('\n')[0];
            } catch {
                null
            }
            try {
                niveau = event.description.val.split('Classe : ')[1];
                niveau = niveau.split(' ')[0];
            } catch {
                null
            }
            insert_event(db, event.title, niveau, classe, salle, formatted_date, start_houre, end_houre, id, function (err, result) {
                if (err) callback(err, null);
            })
        }
    })
    callback(null, true);
}

/**
 * function get a collection of all event who contains teacher given id
 * @param id {int} teacher id
 * @param callback {function} callback function (err, result)
 */
function get_events_by_teacher_id(id, callback)
{
    pool.getConnection((err, db) =>
    {
        if(err) callbakc(err, null);
        db.query(
            {
                sql: SQL.select.event_by_teacher_id,
                timeout: 30000,
                values: [id]
            },
            (err, rows, fields) => {
                if(err) throw err;
                let obj = [];
                for (let row of rows)
                {
                    obj.push(build_event(row.discipline, row.heure_debut, row.heure_fin, row.salle, row.id_ev, row.classe, row.salle));
                }
                console.log(obj);
                callback(null, obj);
            }
        )
    })
}

// ---------------------------------------------------- MAINS FUNCTIONS --------------------------------------------- //

/**
 * function insert timetable in the database
 * @param req router paramaters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function insert_timetable(req, res, callback)
{
    console.log("parsing calendrier")
    parse_edt(req.body.url, (err, result) =>
    {
        console.log("insertion des evenement")
        let data = [...result];
        insert_all_events(result, req.session.id_ens, (err, result) =>
        {
            if(err) callback(err, null);
            callback(null, data);
        })
    })
}

/**
 * function get timetable by querying the sql database
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function get_timetable(req, res, callback)
{
    get_events_by_teacher_id(req.session.id_ens, (err, result) =>
    {
        console.log(result);
        if(err) callback(err, null);
        callback(null, result)
    })
}

// --------------------------------------------------- EXPORTS ------------------------------------------------------ //
module.exports =
    {
    get_events_by_teacher_id,
    insert_all_events,
    insert_timetable,
    get_timetable,
    };