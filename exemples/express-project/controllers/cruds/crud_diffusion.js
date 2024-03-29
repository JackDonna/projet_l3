const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Retrieves diffusions by teacher ID from the database.
 *
 * @param {number} teacherId - The ID of the teacher to retrieve diffusions for.
 * @param {function} callback - The callback function to handle the results.
 * @return {void}
 */
const getYourDiffusionsSQL = (teacherId, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.diffusionByteachers,
                timeout: 10000,
                values: [teacherId],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
};

/**
 * Inserts diffusion SQL into the database.
 *
 * @param {number} id_teach - The ID of the teacher.
 * @param {number} id_abs - The ID of the abstract.
 * @param {function} callback - The callback function.
 * @return {void}
 */
const insertDiffusionSQL = (id_teach, id_abs, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.diffusion,
                timeout: 10000,
                values: [id_teach, id_abs],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, true);
            }
        );
    });
};
// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Retrieves the diffusions associated with a specific teacher.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function.
 * @param {Error} callback.err - The error, if any.
 * @param {Array} callback.result - The result array of diffusions.
 */
const getMyDiffusions = (req, res, callback) => {
    const teacherId = req.params.teacherId;

    getDiffusionByTeachers(teacherId, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
};

/**
 * Inserts diffusions for the specified teacher IDs and absence ID.
 *
 * @param {Array} teacherIDs - The array of teacher IDs
 * @param {number} idAbsence - The ID of the absence
 * @param {function} callback - The callback function
 * @return {boolean} The result of the insertion
 */
const insertDiffusions = (teacherIDs, idAbsence, callback) => {
    teacherIDs.forEach((teacherID) => {
        insertDiffusionSQL(teacherID.id, idAbsence, (err, result) => {
            if (err) callback(err, null);
        });
    });
    callback(null, true);
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { getMyDiffusions, insertDiffusions };
