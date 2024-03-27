const pool = require("../database/db");
const fs = require("fs");
const sql_conf_file = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_conf_file.sql;

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Retrieves diffusion data by teacher ID.
 *
 * @param {number} teacherId - The ID of the teacher
 * @param {function} callback - The callback function
 * @return {void}
 */
function getDiffusionByTeachers(teacherId, callback) {
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
}

function insertDiffusionSQL(id_teach, id_abs, callback) {
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
}
// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Retrieves diffusion data for a specific teacher and invokes a callback with the result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} callback - The callback function to be invoked with the result
 * @return {void}
 */
function getMyDiffusionExport(req, res, callback) {
    const teacherId = req.params.teacherId;
    getDiffusionByTeachers(teacherId, (err, result) => {
        if (err) callback(err, null);
        callback(null, result);
    });
}

function insertDiffusions(tabTeacher, id_abs, callback) {
    tabTeacher.forEach((diffusion) => {
        insertDiffusionSQL(diffusion.id, id_abs, (err, result) => {
            if (err) callback(err, null);
        });
    });
    callback(null, true);
}

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { getMyDiffusionExport, insertDiffusions };
