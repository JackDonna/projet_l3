const mysql = require("mysql");
const fs = require("fs");
const conf = JSON.parse(
    fs.readFileSync("controllers/config/db_config.json", "utf-8")
);
const pool = mysql.createPool(conf);
const sql_config = JSON.parse(
    fs.readFileSync("controllers/config/sql_config.json", "utf-8")
);
const SQL = sql_config.sql;
const Session = require("../utils/session");
const { sendVerificationMailLocal } = require(__dirname + "/crud_mail");
const logger = require("../utils/logger.js");

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //
const rnd = (min, max) => {
    return Math.random() * (max - min) + min;
};

/**
 * Retrieves all teachers from the database.
 *
 * @param {function} callback - Callback function to handle results or errors.
 * @return {void}
 */
const getAllTeachersSQL = (callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.all_teachers,
                timeout: 10000,
                values: [],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

/**
 * Check if a teacher exists by their email in the database.
 *
 * @param {string} mail - The email of the teacher to check
 * @param {function} callback - The callback function to handle the result
 * @return {void}
 */
const isTeacherExistsByMailSQL = (mail, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.teacher_by_mail,
                timeout: 10000,
                values: [mail],
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Retrieves the validation code for a teacher's mail address from the SQL database.
 *
 * @param {string} mail - The email address of the teacher.
 * @param {function} callback - The callback function to handle the result of the query.
 * @return {void}
 */
const getTeacherValidationCodeSQL = (mail, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.teacher_random_number,
                values: [mail],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Validate a teacher using SQL validation code.
 *
 * @param {type} idTeacher - The ID of the teacher to validate
 * @param {type} number - The validation number to compare
 * @param {Function} callback - Callback function to handle the result
 */
const validateTeacherSQL = (idTeacher, number, callback) => {
    getTeacherValidationCodeSQL(idTeacher, (err, result) => {
        if (err) callback(err, null);
        if (result.random_number == number) {
            pool.getConnection((err, db) => {
                db.query(
                    {
                        sql: SQL.update.teacher_validation,
                        values: [idTeacher],
                        timeout: 10000,
                    },
                    (err, rows, fields) => {
                        db.release();
                        callback(err, rows);
                    }
                );
            });
        }
    });
};

/**
 * Check if the provided password matches the identification SQL for a given teacher ID.
 *
 * @param {type} idTeacher - The ID of the teacher
 * @param {type} password - The password to check
 * @param {function} callback - Callback function to handle the result
 * @return {type} Returns the result of the callback function
 */
const isPasswordMatchidentificationSQL = (idTeacher, password, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.identification_by_teacher_id_password,
                values: [idTeacher, password],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Checks if identification exists in the database for a given teacher.
 *
 * @param {number} idTeacher - The ID of the teacher to check identification for.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */
const isIdentificationExistSQL = (idTeacher, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.identificationByTeacherID,
                values: [idTeacher],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Create a profile with the given ID.
 *
 * @param {number} idTeacher - The ID of the profile
 * @param {function} callback - Callback function to handle the result
 * @return {void}
 */
const createProfilSQL = (idTeacher, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.profil,
                values: [idTeacher],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

/**
 * Retrieves the SQL profile of a teacher based on their ID.
 *
 * @param {number} idTeacher - The ID of the teacher.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */
const getProfilSQL = (idTeacher, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select_teacher_profil,
                values: [idTeacher],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

/**
 * Creates an identification SQL entry for a teacher.
 *
 * @param {string} password - The password for the identification.
 * @param {number} idTeacher - The ID of the teacher.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */
const createIdentificationSQL = (password, teacherID, callback) => {
    createProfilSQL(teacherID, (err, result) => {
        if (err) callback(err, null);
        pool.getConnection((err, db) => {
            if (err) callback(err, null);
            let validatioNnumber = Math.round(rnd(150000, 999999));
            db.query(
                {
                    sql: SQL.insert.identification,
                    values: [password, false, validatioNnumber, teacherID],
                    timeout: 10000,
                },
                (err, rows, fields) => {
                    db.release();
                    callback(err, validatioNnumber);
                }
            );
        });
    });
};

/**
 * Check if an administrator exists by email and password in the database.
 *
 * @param {string} mail - The email of the administrator
 * @param {string} password - The password of the administrator
 * @param {function} callback - The callback function to handle the result
 */
const isAdministratorExistByMailPasswordSQL = (mail, password, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.admin_by_mail_password,
                values: [mail, password],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Retrieves unavailable teachers by establishment ID.
 *
 * @param {number} idEtablishement - The ID of the establishment.
 * @param {function} callback - The callback function to handle the result.
 * @return {void}
 */
const getUnavailableTeachersByEtablishementSQL = (
    idEtablishement,
    callback
) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.unavailableTeacherByEtablishement,
                values: [idEtablishement],
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows);
            }
        );
    });
};

/**
 * Retrieves a teacher from the database based on their name.
 *
 * @param {string} name - The name of the teacher to search for.
 * @param {function} callback - The callback function to handle the query result.
 * @return {void}
 */
const searchTeacherSQL = (name, callback) => {
    pool.getConnection((err, db) => {
        if (err) console.error(err);
        db.query(
            {
                sql: SQL.select.searchTeacher,
                values: [name],
                timeout: 100000,
            },
            (err, rows, fields) => {
                db.release();
                callback(err, rows[0]);
            }
        );
    });
};

/**
 * Searches for a teacher in the database whose name is similar to the given name.
 *
 * @param {Object} db - The database connection object.
 * @param {string} name - The name to search for.
 * @param {function} callback - The callback function to be called with the search results.
 * @return {void}
 */
const searchTeacherLikeSQL = (db, name, callback) => {
    db.query(
        {
            sql: SQL.select.teacherLikeName,
            timeout: 10000,
            values: [name],
        },
        (err, rows, fields) => {
            callback(err, rows[0]);
        }
    );
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ---------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------------ //

/**
 * Sign up a teacher and send a verification email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function.
 * @return {undefined}
 */
const signUP = (req, res, callback) => {
    const mail = req.body.mail;
    const password = req.body.password;

    try {
        isTeacherExistsByMailSQL(mail, (err, teacher) => {
            if (err) callback(err, null);
            if(teacher != undefined) {
                isIdentificationExistSQL(teacher.id_ens, (err, identification) => {
                    if (err) callback(err, null);
                    if (identification == undefined) {
                        createIdentificationSQL(
                            password,
                            teacher.id_ens,
                            (err, validationNumber) => {
                                if (err) callback(err, null);
                                sendVerificationMailLocal(
                                    mail,
                                    validationNumber,
                                    (err, res) => {
                                        if (err) {
                                            console.error(err);
                                        }
                                    }
                                );
                                Session.createSession(
                                    req,
                                    teacher.nom,
                                    teacher.prenom,
                                    teacher.mail,
                                    teacher.id_eta,
                                    teacher.id_ens,
                                    false,
                                    false,
                                    (err, res) => {
                                        logger.write("INFO", `Teacher signUP as ${mail}`, "SUCCESS");
                                        callback(null, true);
                                    }
                                );
                            }
                        );
                    } else {
                        logger.write("INFO", `Teacher signUP as ${mail}`, "FAILURE : already exists an identification for this teacher");
                        callback(null, false);
                    }
                });
            }else {
                logger.write("INFO", `Teacher signUP as ${mail}`, "FAILURE : teacher doesn't exist");
                callback(null, false);
            }
        });
    }catch(err) {
        logger.write("ERROR", `Teacher signUP as ${mail}`, err);
    }
};

/**
 * Sign in a teacher using their email and password.
 *
 * @param {Object} req - The request object containing the email and password in the body.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function to be called after the sign-in process.
 * @return {void} The callback function is called with an error (if any) and a boolean indicating if the sign-in was successful.
 */
const signIN = (req, res, callback) => {
    const mail = req.params.mail;
    const password = req.params.password;
    try {
        isTeacherExistsByMailSQL(mail, (err, teacher) => {
            if (teacher != undefined) {
                isPasswordMatchidentificationSQL(
                    teacher.id_ens,
                    password,
                    (err, identification) => {
                        if (err) callback(err, null);
                        if (identification != undefined) {
                            Session.createSession(
                                req,
                                teacher.nom,
                                teacher.prenom,
                                teacher.mail,
                                teacher.id_eta,
                                teacher.id_ens,
                                identification.valide,
                                false,
                                (err, res) => {
                                    logger.write("INFO", `Teacher signIN as ${mail}`, "SUCCESS");
                                    callback(null, true);
                                }
                            );
                        }else {
                            logger.write("INFO", `Teacher signIN as ${mail}`, "FAILURE : Bad password");
                            callback(null, false);
                        }
                    }
                );
            } else {
                logger.write("INFO", `Teacher signIN as ${mail}`, "FAILURE : Bad mail");
                callback(null, false);
            }
        });
    }catch(err) {
        logger.write("ERROR", `Teacher signIN as ${mail}`, err);
    }
    
};

/**
 * Signs in an administrator using the provided request and response, and calls the callback upon completion.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} callback - the callback function
 * @return {void}
 */
const signINAdministrator = (req, res, callback) => {
    const mail = req.params.mail;
    const password = req.params.password;

    isAdministratorExistByMailPasswordSQL(mail, password, (err, admin) => {
        if (err) callback(err, null);
        if (admin != undefined) {
            Session.createSession(
                req,
                admin.nom,
                admin.prenom,
                admin.mail,
                admin.etablissement,
                admin.id_admin,
                true,
                true,
                (err, result) => {
                    callback(null, true);
                }
            );
        } else {
            callback(err, false);
        }
    });
};

/**
 * Validates a teacher using the provided request and response objects.
 *
 * @param {Object} req - the request object containing session and body information
 * @param {Object} res - the response object to send data back
 * @param {Function} callback - the callback function to handle errors and results
 * @return {void}
 */
const validateTeacher = (req, res, callback) => {
    const idTeacher = req.session.id_ens;
    const validationNumber = req.body.number;

    validateTeacherSQL(idTeacher, validationNumber, (err, result) => {
        req.session.valide = true;
        callback(err, result);
    });
};

/**
 * Retrieves the unavailable teachers for a specific establishment.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} callback - The callback function to handle the result.
 * @return {void}
 */
const getYourUnaivalableTeacher = (req, res, callback) => {
    const idEtablishement = req.session.idEtablishement;
    getUnavailableTeachersByEtablishementSQL(
        idEtablishement,
        (err, teachers) => {
            callback(err, teachers);
        }
    );
};

/**
 * Retrieves a teacher from the database based on their name.
 *
 * @param {string} name - The name of the teacher to retrieve.
 * @param {function} callback - The callback function to handle the result. It should have the signature (error, teacher) where 'error' is an error object (if any) and 'teacher' is the retrieved teacher object.
 * @return {void} This function does not return a value.
 */
const getTeacher = (name, callback) => {
    searchTeacherSQL(name, (err, teacher) => {
        callback(err, teacher);
    });
};

/**
 * Retrieves a teacher from the database whose name is similar to the given name.
 *
 * @param {Object} db - The database connection object.
 * @param {string} name - The name of the teacher to search for.
 * @param {function} callback - The callback function to be called with the retrieved teacher.
 * @return {undefined} This function does not return a value.
 */
const getTeacherLike = (db, name, callback) => {
    searchTeacherLikeSQL(db, name, (err, teacher) => {
        callback(err, teacher);
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = {
    getTeacherLike,
    signIN,
    signUP,
    signINAdministrator,
    getYourUnaivalableTeacher,
    getTeacher,
    getTeacherLike,
    validateTeacher,
};
