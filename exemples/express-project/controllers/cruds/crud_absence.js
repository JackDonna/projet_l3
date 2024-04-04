const e = require("express");
const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;
const Diffusion = require(__dirname + "/crud_diffusion");
const Event = require(__dirname + "/crud_event.js");
const axios = require("axios");
const utils = require("../utils/ics_utils");
const ical = require("ical");

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

const downloadTimetableFromURL = (link, callback) => {
    axios
        .get(link, {
            responseType: "blob",
        })
        .then((response) => {
            let data = utils.parseICSURL(response.data, ical);
            callback(null, data);
        });
};
const getTeacherLinkSQL = (db, teacherID, callback) => {
    db.query(
        {
            sql: SQL.select.teacherLink,
            values: [teacherID],
            timeout: 10000,
        },
        (err, rows, fields) => {
            callback(err, rows[0]);
        }
    );
};
const getLinkContent = (db, teacherID, callback) => {
    getTeacherLinkSQL(db, teacherID, (err, link) => {
        if (link != undefined) {
            downloadTimetableFromURL(link.link, (err, timetable) => {
                callback(err, timetable);
            });
        } else {
            callback(err, undefined);
        }
    });
};

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
const getYourAbsencesSQL = (etablishementID, callback) => {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.yourAbsences,
                values: [etablishementID],
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
const filterTeachersByTimetable = (db, date, start, end, teachers, callback) => {
    if (teachers.length == 0) callback(null, []);
    result = [];
    let c = 0;
    teachers.forEach((teacher) => {
        getLinkContent(db, teacher.id, (err, content) => {
            c++;
            if (content != undefined) {
                let array = content.filter(
                    (e) => e.date == date && ((e.start > start && e.end > start) || (e.start < end && e.end < end))
                );
                if ((array.length = 0)) {
                    result.push(teacher);
                }
            } else {
                result.push(teacher);
            }
            if (c == teachers.length) {
                callback(null, result);
            }
        });
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
const filterTeachersByDiscipline = (db, idAbsence, callback) => {
    db.query(
        {
            sql: SQL.select.allTeacherCompatibleWithDisc,
            timeout: 10000,
            values: [idAbsence],
        },
        (err, rows, fields) => {
            callback(err, rows);
        }
    );
};

const insertAbsenceNewSQL = (start, end, date, teacherID, reason, matiere, callback) => {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.insert.absence,
                timeout: 10000,
                values: [reason, start, end, date, matiere, teacherID, date, start, end, start, end, teacherID],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

const selectAbsenceSQL = (start, end, date, teacherID, callback) => {
    pool.getConnection((err, db) => {
        db.query(
            {
                sql: SQL.select.absence,
                timeout: 10000,
                values: [start, end, date, teacherID],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
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

const insertAbsenceNew = (start, end, date, teacherID, reason, matiere, callback) => {
    insertAbsenceNewSQL(start, end, date, teacherID, reason, matiere, (err, result) => {
        if (err) callback(err, null);
        callback(null, true);
    });
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
    getYourAbsencesSQL(req.session.id_eta, (err, res) => {
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
const spreadAbsence = (absence, callback) => {
    pool.getConnection((err, db) => {
        filterTeachersByDiscipline(db, absence.id_abs, (err, disciplineResult) => {
            filterTeachersByTimetable(db, absence.date, absence.start, absence.end, disciplineResult, (err, scheduleResult) => {
                Diffusion.insertDiffusions(db, scheduleResult, absence.id_abs, (err, result) => {
                    if(err) console.error(err)
                    db.release();
                    console.log(
                        "\u001b[" +
                            32 +
                            "m" +
                            `[DIFFUSION : "AUTO LAUNCHED PROCESS" - (${new Date().toLocaleString()}) - OK / ABSENCE SPREADED]` +
                            "\u001b[0m"
                    );
                    callback(err, scheduleResult);
                });
            });
        });
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = {
    insertAbsence,
    getYourAbsences,
    filterTeachersByTimetable,
    filterTeachersByDiscipline,
    spreadAbsence,
    insertAbsenceNew,
    selectAbsenceSQL,
};
