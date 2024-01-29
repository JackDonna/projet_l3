const db = require("../db");
const axios = require("axios");
const utils = require("../utils/ics_utils");
const fs = require("fs");

let config = fs.readFileSync("controllers/utils/eventColorsConfig.json", 'utf8');
config = JSON.parse(config);
const colors = config.colors;

let sql_config = fs.readFileSync("controllers/config/sql_config.json", "utf-8");
sql_config = JSON.parse(sql_config);
const SQL = sql_config.sql;

exports.insert_discipline = (discipline, callback) =>
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
        }
    )
}

exports.select_discipline_by_name = (discipline, callback) =>
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
        }
    )
}

exports.select_discipline_by_id = (id_discipline, callback) =>
{
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
}

exports.insert_event = (discipline, niveau, classe, salle, date, heure_debut, heure_fin, enseignant, callback) =>
{
    insert_discipline(discipline, function(err, result)
    {
        if(err) callback(err,null)
        select_discipline_by_name(discipline, function(err, result)
        {
            if(err) callback(err, null);
            db.query(
                {
                    sql: SQL.insert.evenement,
                    timeout: 10000,
                    values: [result.id_disc, niveau, classe, salle, date, heure_debut, heure_fin, enseignant]
                },
                (err, rows, fields) => {
                    if(err) callback(err, null);
                    callback(null, true);
                }
            )
        })
    })
}

exports.get_edt = (link, ical, callback) =>
{
    axios.get(link,
        {
            responseType : 'blob'
        }).then((response) => {
        let data = utils.parseICSURL(response.data, ical);
        callback(null, data);
    })
}

exports.insert_all_events = (events, id, callback) =>
{
    for (let event of events)
    {
        let start_houre = new Date(event.start);


        let end_houre = new Date(event.end);

        let formatted_date = new Date(event.start).toISOString().split('T')[0];

        let salle;
        try {
            salle = event.description.val.split('Salle : ')[1];
            salle = salle.split('\n')[0];
        } catch (error) {
            salle = null;
        }

        let classe;
        try {
            classe = event.description.val.split('Classe : ')[1];
            classe = classe.split('\n')[0];
        } catch (error) {
            classe = null;
        }

        let niveau;
        try {
            niveau = event.description.val.split('Classe : ')[1];
            niveau = niveau.split(' ')[0];
        } catch (error) {
            niveau = null;
        }

        insert_event(event.title, niveau, classe, salle, formatted_date, start_houre, end_houre, id, function(err, result)
        {
            if(err) callback(err, null);
        })
    }
    callback(null, true);
}

exports.get_events_by_enseignant_id = (id, callback) => {
    db.query(
        {
            sql: SQL.select.event_by_enseignant_id,
            timeout: 30000,
            values: [id]
        },
        (err, rows, fields) => {
            if(err) throw err;
            let obj = [];
            for (let event of rows)
            {
                if(err) throw err;
                let x = {
                    title: event.discipline,
                    start: event.heure_debut,
                    end:  event.heure_fin,
                    location: event.salle,
                }
                if(x.title.toLowerCase().includes("cours annul"))
                {
                    x.backgroundColor = "rgb(200,50,50)";
                    x.event_type = "CANCELED";
                }
                else
                {
                    for(let color of colors)
                    {
                        if(x.title.toLowerCase().includes(color.name))
                        {
                            x.backgroundColor = color.color;
                        }
                    }
                }
                obj.push(x);
            }
            callback(null, obj);
        }
    )
}