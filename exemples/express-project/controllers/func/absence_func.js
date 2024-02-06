const db = require("../db");
const fs = require("fs");

let sql_config = fs.readFileSync("controllers/config/sql_config.json", "utf-8");
sql_config = JSON.parse(sql_config);
const SQL = sql_config.sql;

const Event = require("../func/event_func")

exports.select_all_absence_beewtween_two_dates = (d_debut, d_fin, callback) =>
{
    db.query(
        {
            sql: SQL.sql.all_absence_beetween_two_dates,
            timeout: 10000,
            values: [d_debut, d_fin]
        },
        (err, rows, fields) => {
            if(err) callback(err, null);
            let obj = []
        
            for(let i in rows){
                Event.select_discipline_by_id(rows[i].discipline, function(err, result){
                    obj.push({
                        'id_abs' : rows[i].id_abs, 
                        'motif' : rows[i].motif, 
                        'discipline' : discipline, 
                        'niveau': rows[i].niveau,
                        'classe': rows[i].classe, 
                        'salle': rows[i].salle, 
                        'heure_debut': rows[i].heure_debut, 
                        'heure_fin': rows[i].heure_fin
                        })
                })  
            }
            callback(null, obj);
        }
    )
}

exports.get_event_by_date_and_classroom = (heure_debut, heure_fin, classe, salle, callback) => 
{
    db.query(
        {
            sql: SQL.sql.select.event_by_date_and_classroom,
            timeout: 10000,
            values: [heure_debut, heure_fin, classe, salle]
        },
        (err, rows, fields) => {
            if(err) console.err(err);
            Event.select_discipline_by_id(rows[0].discipline, function(err, result){
                let obj = {
                    'id_ev' : rows[0].id_ev,
                    'discipline' : result,
                    'niveau' : rows[0].niveau,
                    'classe': rows[0].classe, 
                    'salle': rows[0].salle, 
                    'heure_debut': rows[0].heure_debut, 
                    'heure_fin': rows[0].heure_fin,
                    'enseignant': rows[0].enseignant
                }
                callback(null, obj)
            })
        }) 
}

exports.insert_absence = (motif, id_event, callback) =>
{
    db.query(
        {
            sql: SQL.insert.absence,
            timeout: 10000,
            values: [motif, id_event]
        },
        (err, rows, fields) => {
            if (err) throw err
            callback(null, true)
    })
}
