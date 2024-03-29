const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;
const Diffusion = require(__dirname + "/crud_diffusion");

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Insert an absence record into the database.
 *
 * @param {string} reason - The reason for the absence
 * @param {number} idEvent - The event ID associated with the absence
 * @param {function} callback - The callback function
 * @return {boolean} Indicates if the absence was successfully inserted
 */
const insertAbsenceSQL = (reason, idEvent, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.absence,
                timeout: 10000,
                values: [reason, idEvent],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, true);
            }
        );
    });
};

/**
 * Retrieves the absences available without a specific teacher using the teacher's ID.
 *
 * @param {number} idTeacher - The ID of the teacher
 * @param {function} callback - The callback function
 * @return {void}
 */
const getAbsenceWithoutThisTeacherSQL = (teacherID, callback) => {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.absence_available,
                values: [teacherID],
                timeout: 3000,
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
};

/**
 * Filters the list of teachers based on their timetable.
 *
 * @param {Date} date - The date to filter the teachers by.
 * @param {string} start - The start time of the timetable.
 * @param {string} end - The end time of the timetable.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */

/**
 * Retrieves available teachers based on date and time range.
 *
 * @param {Date} date - The date for which to check teacher availability
 * @param {string} start - The start time of the time range
 * @param {string} end - The end time of the time range
 * @param {function} callback - Callback function to handle the results
 * @return {void}
 */
const filterTeachersByTimetable = (date, start, end, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.allTeacherAvailableTheTrueOne,
                timeout: 10000,
                values: [date, start, end, start, end, start, end],
            },
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    });
};

/**
 * Retrieves all teachers compatible with a given discipline.
 *
 * @param {number} id - The ID of the discipline.
 * @param {function} callback - The callback function to handle the result.
 *                             It takes two parameters: error and rows.
 * @return {void}
 */
const filterTeachersByDiscipline = (idEvent, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.allTeacherCompatibleWithDisc,
                timeout: 10000,
                values: [idEvent],
            },
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Inserts an absence record into the database.
 *
 * @param {Object} req - The request object containing the absence data.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function to handle the result of the insertion.
 * @return {void}
 */
const insertAbsence = (req, res, callback) => {
    try {
        insertAbsenceSQL(req.body.motif, req.body.id_event, (err, result) => {
            if (err) callback(err, null);
            callback(null, true);
        });
    } catch (err) {
        console.error(err);
    }
};

/**
 * Retrieves absences for the current user.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {function} callback - the callback function
 * @return {void}
 */
const getYourAbsences = (req, res, callback) => {
    getAbsenceWithoutThisTeacherSQL(req.session.id_ens, (err, res) => {
        if (err) callback(err, null);
        callback(null, res);
    });
};

/**
 * Function to spread absence based on provided request and response, and invoke the callback upon completion.
 *
 * @param {Object} req - the request object containing information about the absence
 * @param {Object} res - the response object to send the absence spreading result
 * @param {Function} callback - the callback function to be invoked after absence spreading
 * @return {void} This function does not return a value
 */
const spreadAbsence = (req, res, callback) => {
    const isIdInFilterResult = (element, array) => {
        for (let value of array) {
            if (value.id == element) {
                return true;
            }
        }
        return false;
    };
    const intersectFiltersResults = (a, b) => {
        let res = [];
        a.forEach((value) => {
            if (isIdInFilterResult(value.id, b)) res.push(value);
        });
        return res;
    };
    let id = req.body.ev.id;
    let date = new Date(req.body.ev.start).toLocaleDateString("sv-SE");
    let start = new Date(req.body.ev.start).toLocaleTimeString();
    let end = new Date(req.body.ev.end).toLocaleTimeString();

    filterTeachersByTimetable(date, start, end, (err, scheduleResult) => {
        filterTeachersByDiscipline(id, (err, disciplineResult) => {
            let result = intersectFiltersResults(scheduleResult, disciplineResult);
            Diffusion.insertDiffusions(result, id, (err, result) => {
                console.log(
                    "\u001b[" +
                        32 +
                        "m" +
                        `[DIFFUSION : "AUTO LAUNCHED PROCESS" - (${new Date().toLocaleString()}) - OK / ABSENCE SPREADED]` +
                        "\u001b[0m"
                );
                callback(err, result);
            });
        });
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { insertAbsence, getYourAbsences, filterTeachersByTimetable, filterTeachersByDiscipline, spreadAbsence };
