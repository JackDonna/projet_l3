const mysql = require("mysql");
const fs = require("fs");
const conf = JSON.parse(
    fs.readFileSync("controllers/config/db_config.json", "utf-8")
);
const pool = mysql.createPool(conf);
const sql_conf_file = JSON.parse(
    fs.readFileSync("controllers/config/sql_config.json", "utf-8")
);
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
                sql: SQL.select.diffusionByTeachers,
                timeout: 10000,
                values: [teacherId],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

/**
 * Retrieves teacher ID by diffusions from the database.
 *
 * @param {number} AbsId - The ID of the absence to retrieve diffusions for.
 * @param {function} callback - The callback function to handle the results.
 * @return {void}
 */
const getDiffusionsAbsSQL = (AbsId, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.diffusionByAbsence,
                timeout: 10000,
                values: [AbsId],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
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
const insertDiffusionSQL = (db, id_teach, id_abs, callback) => {
    db.query(
        {
            sql: SQL.insert.diffusion,
            timeout: 10000,
            values: [id_teach, id_abs, id_teach, id_abs],
        },
        (err, rows, fields) => {
            callback(err, true);
        }
    );
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
    const teacherId = req.session.id_ens;

    getYourDiffusionsSQL(teacherId, (err, result) => {
        callback(err, result);
    });
};

/**
 * Retrieves the diffusions associated with a specific absence.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function.
 * @param {Error} callback.err - The error, if any.
 * @param {Array} callback.result - The result array of diffusions.
 */
const getDiffusionsProvisor = (req, res, callback) => {
    const AbsId = req.params.id_abs;
    getDiffusionsAbsSQL(AbsId, (err, result) => {
        callback(err, result);
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
const insertDiffusions = (db, teacherIDs, idAbsence, callback) => {
    if (teacherIDs == undefined) callback(null, false);
    teacherIDs.forEach((teacherID) => {
        insertDiffusionSQL(db, teacherID.id, idAbsence, (err, result) => {
            if (err) callback(err, null);
        });
    });
    callback(null, true);
};

/**
 * Delete a teacher ID from the database in the list of diffusions.
 *
 * @param {number} teacherId - The ID of the teacher to to delete in diffusion.
 * @param {number} absenceId - The ID of the absence.
 * @param {function} callback - The callback function to handle the results.
 * @return {void}
 */
const deleteOnDiffusion = (teacherId, absenceId, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.delete.teacher_diffusion,
                timeout: 10000,
                values: [teacherId, absenceId],
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, true);
            }
        );
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { getMyDiffusions, insertDiffusions, getDiffusionsProvisor };
