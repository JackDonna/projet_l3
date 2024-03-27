const pool = require("../database/db");
const fs = require("fs");
const axios = require("axios");
const { forEach } = require("async");
const sql_config = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_config.sql;
const readline = require("readline");
const Teacher = require(__dirname + "/crud_teacher");

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

function getClasseByName(db, className, callback) {
    db.query(
        {
            sql: SQL.select.classeByName,
            timeout: 10000,
            values: [className],
        },
        (err, rows, fields) => {
            if (err) callback(err, null);
            callback(null, rows[0]);
        }
    );
}

function linkTeacherToClasse(db, teacherId, classeId, callback) {
    db.query(
        {
            sql: SQL.insert.linkTeacherClasse,
            timeout: 10000,
            values: [teacherId, classeId],
        },
        (err, rows, fields) => {
            if (err) callback(err, null);
            callback(null, rows);
        }
    );
}

function getFilesClasse(callback) {
    let path = "controllers/misc/classes";
    let files = fs.readdirSync(path);
    let c = 1;
    files.forEach((file) => {
        testInsert(c, files.length, file);
        c++;
    });
}

function testInsert(c, l, file) {
    const path = "controllers/misc/classes/" + file;
    const content = fs.readFileSync(path, "utf-8");
    let lines = content.split("\n");
    let query = `INSERT INTO Panel (enseignant, classe) VALUES`;
    let subClasseQuery = `(SELECT id_class FROM Ref_Classe WHERE classe = '${file.split(".")[0]}')`;
    lines.forEach((line) => {
        let teacherName = line.split(" ")[0];
        let subquery = `(select id_ens from Enseignant where nom = "${teacherName}")`;
        query += ` (${subquery},${subClasseQuery}),`;
    });
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: query.substring(0, query.length - 1),
                timeout: 10000,
            },
            (err, rows, fields) => {
                if (err) console.error(err);
                db.release();
                if (c == l) {
                    console.log(
                        "\u001b[" +
                            32 +
                            "m" +
                            `[CLASSES : "AUTO LAUNCHED PROCESS" - (${new Date().toLocaleString()}) - OK / CLASSES INSERTED]` +
                            "\u001b[0m"
                    );
                }
            }
        );
    });
}

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { getFilesClasse };
