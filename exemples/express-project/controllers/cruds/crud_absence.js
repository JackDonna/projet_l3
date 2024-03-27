const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * function insert an absence in the sql database
 * @param motif {string} reason of the absence
 * @param id_event {int} id of the event
 * @param callback {function} callback function (err, result)
 */
function insert_absence(motif, id_event, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.absence,
                timeout: 10000,
                values: [motif, id_event],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, true);
            }
        );
    });
}

/**
 * function get list of teacher in sql database
 * @param debut {datetime} begining of the event
 * @param fin {datetime} end of the event
 * @param callback {function} callback function (err, result)
 */
function prof_dispo(date, debut, fin, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.allTeacherAvailableTheTrueOne,
                timeout: 10000,
                values: [date, debut, fin, debut, fin, debut, fin],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
}

/**
 * Retrieves the available absence for a given ID.
 *
 * @param {string} id_ens - The ID for which to retrieve the available absence
 * @param {function} callback - The callback function to handle the query results
 * @return {void}
 */
function get_available_absence(id_ens, callback) {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.absence_available,
                values: [id_ens],
                timeout: 3000,
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
}

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * function insert a new absence with the router parameters
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function insert_new_absence(req, res, callback) {
    try {
        insert_absence(req.body.motif, req.body.id_event, (err, result) => {
            if (err) callback(err, null);
            callback(null, true);
        });
    } catch (err) {
        console.error(err);
    }
}

/**
 * function get the list of teacher with router parameters
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function getAvailableTeacher(date, debut, fin, callback) {
    prof_dispo(date, debut, fin, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
}

/**
 * Retrieves the absence information for a given request.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} callback - the callback function
 * @return {undefined}
 */
function get_absence(req, res, callback) {
    get_available_absence(req.session.id_ens, (err, res) => {
        if (err) callback(err, null);
        callback(null, res);
    });
}

/**
 * function get nomenclature from courses
 * @param courses {integer} id of courses
 * @param callback {function} callback function (err, result)
 */
function nomenclature_by_courses(courses, callback) {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.nomenclature_by_matiere,
                timeout: 10000,
                values: [courses[0].matiere],
            },
            (err, rows, fields) => {
                if (err) throw err;
                callback(null, rows);
            }
        );
    });
}

/**
 * function get id_mat by id_abs
 * @param absence {integer} id of absence/
 * @param callback {function} callback function (err, result)
 */
function courses_by_evenement(id_ev, callback) {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.get_matiere_by_evenement,
                timeout: 10000,
                values: [id_ev],
            },
            (err, rows, fields) => {
                if (err) throw err;
                callback(null, rows);
            }
        );
    });
}

/**
 * function get id_discipline by nomenclature
 * @param nomenclature {integer} number of nomnclature
 * @param callback {function} callback function (err, result)
 */
function discipline_by_nomenclture(nomenclature, callback) {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.discipline_by_nomenclature,
                timeout: 10000,
                values: [nomenclature[0].nomenclature],
            },
            (err, rows, fields) => {
                if (err) throw err;
                callback(null, rows[0]);
            }
        );
    });
}

/**
 * function get id_discipline by nomenclature
 * @param discipline {integer} number of nomnclature
 * @param teacher {integer} number of nomnclature
 * @param callback {function} callback function (err, result)
 */
function correspondance_by_discipline(db, discipline, teacher, callback) {
    db.query(
        {
            sql: SQL.select.teacher_by_discipline,
            timeout: 10000,
            values: [teacher, discipline],
        },
        (err, rows, fields) => {
            if (err) throw err;
            callback(null, rows);
        }
    );
}

/**
 * function get list of teacher match with courses
 * @param absence {integer} id of courses
 * @param teacher {integer} id of teacher
 * @param callback {function} callback function (err, result)
 */
function getAvailableTeacherByDisc(id, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.allTeacherCompatibleWithDisc,
                timeout: 10000,
                values: [id],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
}

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { insert_new_absence, getAvailableTeacher, get_absence, getAvailableTeacherByDisc };
