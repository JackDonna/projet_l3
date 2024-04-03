const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------- //

/**
 * Inserts a new proposition into the database for a given teacher and absence.
 *
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} absenceId - The ID of the absence.
 * @param {function} callback - The callback function to handle the result of the query.
 * @return {void}
 */
const insertPropositionSQL = (teacherId, absenceId, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.proposition,
                timeout: 10000,
                values: [teacherId, absenceId],
            },
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    });
};

/**
 * Retrieves the proposed teacher SQL query result based on the provided absence ID.
 *
 * @param {number} absenceId - The ID of the absence to retrieve proposed teacher for.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */
const getProposedTeacherSQL = (absenceId, callback) => {
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
};

/**
 * Insert a proposition for a teacher into the database.
 *
 * @param {number} teacherId - The ID of the teacher
 * @param {number} propositionId - The ID of the proposition
 * @param {function} callback - Callback function to handle results
 * @return {void}
 */
const insertAcceptedPropositionSQL = (teacherID, propositionID, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.remplacement,
                timeout: 10000,
                values: [teacherID, propositionID],
            },
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    });
};

/**
 * Get the SQL for your replacement based on the establishment ID.
 *
 * @param {type} etablishementID - The ID of the establishment
 * @param {type} callback - The callback function
 * @return {type} description of return value
 */
const getYourReplaceSQL = (etablishementID, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.yourReplace,
                timeout: 10000,
                values: [etablishementID],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

// -------------------------------------------------- MAINS FUNCTIONS ------------------------------------------------ //

/**
 * Add the teahcer in the proposition list and invokes a callback with the result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be invoked with the result
 * @return {void}
 */
const insertProposition = (req, res, callback) => {
    const teacherID = req.body.teacherID;
    const absenceID = req.body.absenceID;

    insertPropositionSQL(teacherID, absenceID, (err, result) => {
        callback(err, result);
    });
};

/**
 * Get all the teacher who propose on an absence.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be invoked with the result
 * @return {void}
 */
const getProposedTeacher = (req, res, callback) => {
    const absenceID = req.params.abs;

    getProposedTeacherSQL(absenceID, (err, result) => {
        callback(err, result);
    });
};

const acceptProposition = (req, res, callback) => {
    const teacherID = req.body.teacherID;
    const propositionID = req.body.propositionID;

    insertAcceptedPropositionSQL(teacherID, propositionID, (err, result) => {
        callback(err, result);
    });
};

const getYourReplace = (req, res, callback) => {
    const etablishementID = req.session.idEtablishement;

    getYourReplaceSQL(etablishementID, (err, result) => {
        callback(err, result);
    });
};
// -------------------------------------------------- EXPORTS -------------------------------------------------------- //

module.exports = { insertProposition, getProposedTeacher, acceptProposition, getYourReplace };
