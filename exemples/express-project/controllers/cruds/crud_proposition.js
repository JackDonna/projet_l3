const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------- //

/**
 * Add a Teacher in the proposition list.
 *
 * @param {number} teacherId - The ID of the teacher
 * @param {number} absenceId - The ID of the absence
 * @param {function} callback - The callback function
 * @return {void}
 */
function proposeOnAbsence(teacherId, absenceId, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.proposition,
                timeout: 10000,
                values: [teacherId, absenceId],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
}

/**
 * Get all the teacher who propose on an absence.
 *
 * @param {number} absenceId - The ID of the absence
 * @param {function} callback - The callback function
 * @return {void}
 */
function PropositionOnAbsence(absenceId, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.allProposedTeacher,
                timeout: 10000,
                values: [absenceId],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
}

function insertProposition(teacherId, propositionId, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.remplacement,
                timeout: 10000,
                values: [teacherId, propositionId],
            },
            (err, rows, fields) => {
                if (err) callback(err, false);
                callback(null, true);
            }
        );
    });
}

// -------------------------------------------------- MAINS FUNCTIONS ------------------------------------------------ //

/**
 * Add the teahcer in the proposition list and invokes a callback with the result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be invoked with the result
 * @return {void}
 */
function proposeOnAbsenceExport(req, res, callback) {
    const teacherId = req.body.teacherId;
    const absenceID = req.body.absenceID;
    proposeOnAbsence(teacherId, absenceID, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
}

/**
 * Get all the teacher who propose on an absence.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be invoked with the result
 * @return {void}
 */
function getPropositionOnAbsence(req, res, callback) {
    const absenceID = req.params.abs;
    PropositionOnAbsence(absenceID, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
}

/**
 * Accepts a proposition sent in the request body, inserts it into the database, and calls the callback with the result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be called with the result
 * @return {void}
 */
function acceptProposition(req, res, callback) {
    const teacherId = req.body.teacherId;
    const propositionId = req.body.propositionId;
    insertProposition(teacherId, propositionId, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
}

// -------------------------------------------------- EXPORTS -------------------------------------------------------- //

module.exports = { proposeOnAbsenceExport, getPropositionOnAbsence, acceptProposition };
