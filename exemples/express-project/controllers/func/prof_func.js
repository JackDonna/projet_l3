const { callbackify } = require("util");
const db = require("../db");
const fs = require("fs");

let sql_config = fs.readFileSync("controllers/config/sql_config.json", "utf-8");
sql_config = JSON.parse(sql_config);
const SQL = sql_config.sql;

exports.recup_liste_prof_dispo = (debut, fin, callback) =>
{
    db.query(
        {
            sql: SQL.select.available_teacher,
            timeout: 10000,
            values: [debut, fin, debut, fin]
        },
        (err, rows, fields) => {
            if(err) callback(err, null);
            callback(null, rows);
        }
    )
}