const pool = require("../database/db");
const fs = require("fs");
const axios = require("axios");
const sql_config = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_config.sql;

// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------ //
/**
 * function return pseudo-random number between the given numbers
 * @param min {int} min number
 * @param max {int} min number
 * @returns {*}
 */
function rnd(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * function set the session (need router parameters) with given credentials
 * @param req router context
 * @param name {string} name of the session
 * @param firstname {firstname} firstname of the session
 * @param mail {string} mail of the session
 * @param idEtablishement
 * @param validation {boolean} tell if the session is a valide session or not
 * @param id_teacher {int} id of the teacher own this session
 * @param admin
 * @param callback {function} callback function (err, result)
 */
function set_session(req, name, firstname, mail, idEtablishement, validation, id_teacher, admin, callback) {
    req.session.regenerate((err) => {
        if (err) callback(err, null);
        req.session.nom = name;
        req.session.prenom = firstname;
        req.session.mail = mail;
        req.session.idEtablishement = idEtablishement;
        req.session.valide = validation;
        req.session.id_ens = id_teacher;
        req.session.admin = admin;
        req.session.save((err) => {
            if (err) callback(err, null);
            callback(null, true)
        })
    })
}

/**
 * function check if a teacher exist with the mail and password by select and return him
 * @param mail {string} mail of the searched teacher
 * @param password {string} password of the searched teacher
 * @param callback {function} callback function (err, result)
 */
function check_teacher_by_mail_password(mail, password, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.teacher_by_mail_password,
                timeout: 10000,
                values: [mail, password]
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}

/**
 * function check if a teacher exist with the mail by select and return him
 * @param mail {string} mail of the searched teacher
 * @param callback {function} callback function (err, result)
 */
function check_teacher_by_mail(mail, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.teacher_by_mail,
                timeout: 10000,
                values: [mail]
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}

/**
 * function insert a teacher in the SQL database
 * @param mail {string} mail of the new teacher
 * @param password {string} password of the new teacher
 * @param nom {string} name of the new teacher
 * @param prenom {string} firstname of the new teacher
 * @param callback {function} callback function (err, result)
 */
function insert_user(mail, password, nom, prenom, callback) {
    let number = Math.round(rnd(190556, 999999));
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.insert.teacher,
                timeout: 10000,
                values: [mail, password, nom, prenom, number, false]
            },
            (err, rows, flield) => {
                if (err) callback(err, null);
                callback(null,
                    {
                        nom: nom,
                        prenom: prenom,
                        mail: mail,
                        valide: false,
                        number: number
                    });
            }
        )
    })
}

/**
 * function insert a new teacher in the sql database, and check befor if the user already exist
 * @param mail {string} mail of the new teacher
 * @param password {string} password of the new teacher
 * @param nom {string} name of the new teacher
 * @param prenom {string} firstname of the new teacher
 * @param callback {function} callback function (err, result)
 */
function insert_new_user(mail, password, nom, prenom, callback) {
    check_teacher_by_mail(mail, (err, result) => {
        if (err) callback(err, null);
        if (result === undefined) {
            insert_user(mail, password, nom, prenom, (err, result) => {
                if (err) callback(err, null);
                callback(null, result);
            })
        } else {
            callback(null, false);
        }
    })
}

/**
 * function select only the random number of the wanted teacher by the mail
 * @param mail {string} mail of the wanted teacher
 * @param callback {function} callback function (err, result)
 */
function select_teacher_random_number(mail, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.teacher_random_number,
                values: [mail],
                timeout: 10000
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0].random_number);
            })
    })
}

/**
 * function validate a teacher by check if the code is correct and change the validation state of the teacher in the database
 * @param mail {string} mail of the teacher
 * @param number {int} number send by the user who want to be connected as a teacher
 * @param callback {function} callback function (err, result)
 */
function validate_teacher_by_mail(id_ens, number, callback) {
    select_teacher_random_number(id_ens, (err, result) => {
        if (err) callback(err, null);
        if (result == number) {
            pool.getConnection((err, db) => {
                db.query(
                    {
                        sql: SQL.update.teacher_validation,
                        values: [id_ens],
                        timeout: 10000
                    },
                    (err, rows, fields) => {
                        if (err) callback(err, null);
                        callback(null, true);
                    })
            })
        }
    })
}

function check_identification(id_ens, password, callback) {
    pool.getConnection((err, database) => {
        if (err) callback(err, null);
        database.query(
            {
                sql: SQL.select.identification_by_teacher_id_password,
                values: [id_ens, password]
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}


function create_profil(id_ens, callback) {
    pool.getConnection((err, database) => {
        if (err) callback(err, null);
        database.query(
            {
                sql: SQL.insert.profil,
                values: [id_ens],
                timeout: 10000
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, true);
            }
        )
    })
}

function get_profil(id_ens, callback) {
    pool.getConnection((err, database) => {
        if (err) callback(err, null);
        database.query(
            {
                sql: SQL.select_teacher_profil,
                values: [id_ens],
                timeout: 10000
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}


function create_identification(password, id_ens, callback) {
    create_profil(id_ens, (err, result) => {
        if (err) callback(err, null);
        pool.getConnection((err, database) => {
            let nb = Math.round(rnd(150000, 999999));
            if (err) callback(err, null);
            database.query(
                {
                    sql: SQL.insert.identification,
                    values: [password, false, nb, id_ens],
                    timeout: 10000
                },
                (err, rows, fields) => {
                    if (err) callback(err, null);
                    callback(null, nb)
                }
            )
        })
    })

}

function check_admin_by_mail_pasword(mail, password, callback) {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: SQL.select.admin_by_mail_password,
                values: [mail, password],
                timeout: 10000
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows[0]);
            }
        )
    })
}

function getUnavailableTeachersByEtablishement(idEtablishement, callback) {
    pool.getConnection((err, sqlDatabase) => {
        if (err) callback(err, null);
        sqlDatabase.query(
            {
                sql: SQL.select.unavailableTeacherByEtablishement,
                values: [idEtablishement],
                timeout: 10000
            },
            (err, rows, fields) => {
                if (err) callback(err, null);
                callback(null, rows);
            }
        )
    })
}


// ---------------------------------------------------- MAINS FUNCTIONS --------------------------------------------- //
/**
 * function to sign_up as a teacher by creating a teacher in the database and change the session credential
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function sign_up(req, res, callback) {
    check_teacher_by_mail(req.body.mail, (err, teacher) => {
        if (teacher != undefined) {
            create_identification(req.body.password, teacher.id_ens, (err, identification) => {
                if (err) callback(err, null);
                axios.get("mail/send_verification_mail/" + req.body.mail + "/" + identification);
                set_session(req, teacher.mail, teacher.prenom, teacher.nom, false, teacher.id_ens, false, (err, res) => {
                    callback(null, true);
                })
            })
        }
    })
}

/**
 * function to sign_in as a teacher by checking the credential and set the session
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function sign_in(req, res, callback) {
    check_teacher_by_mail(req.params.mail, (err, teacher) => {
        if (teacher != undefined) {
            check_identification(teacher.id_ens, req.params.password, (err, identification) => {
                if (err) callback(err, null);
                if (identification != undefined) {
                    set_session(req, teacher.nom, teacher.prenom, teacher.mail, teacher.id_eta, identification.valide, teacher.id_ens, false, (err, res) => {
                        callback(null, true);
                    })
                }
            })
        } else {
            callback(err, null);
        }

    })
};

function sign_in_admin(req, res, callback) {
    check_admin_by_mail_pasword(req.params.mail, req.params.password, (err, admin) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (admin != undefined) {
            set_session(req, admin.nom, admin.prenom, admin.mail, admin.etablissement, true, admin.id_admin, true, (err, result) => {
                callback(null, true);
            })
        } else {
            callback(err, false);
        }
    })
}

/**
 * function to validate a teacher by checking the random number and set the session and the database
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function validate_teacher(req, res, callback) {
    validate_teacher_by_mail(req.session.id_ens, req.body.number, (err, result) => {
        if (err) callback(err, null);
        req.session.valide = 1;
        callback(null, true);
    })
}

function getTeacherForAdminPanel(req, res, callback) {
    getUnavailableTeachersByEtablishement(req.session.idEtablishement, (err, teachers) => {
        if (err) callback(err, null);
        callback(null, teachers);
    })
}

// --------------------------------------------------- EXPORTS ------------------------------------------------------ //
module.exports =
    {
        validate_teacher,
        sign_in,
        sign_up,
        sign_in_admin,
        getTeacherForAdminPanel
    }


// Supprime un user
// exports.user_delete = asyncHandler(async (req, res, next) => {
//     pool.getConnection((err, db) =>
//     {
//         db.query("DELETE FROM `Enseignant` WHERE `id_ens`=?", [req.params.id] ,(err, rows, fields) => {
//             if (err) throw err
//             res.send(`user delete OK`);
//         })
//     })
// });

// Modifie un user
// exports.user_update = asyncHandler(async (req, res, next) => {
//     pool.getConnection((err, db) =>
//     {
//         db.query("UPDATE `Enseignant` SET `nom`=?,`prenom`=? WHERE `id_ens`=?", [req.params.nom,req.params.prenom, req.params.id] ,(err, rows, fields) => {
//             if (err) throw err
//             res.send(`user update OK`);
//         })
//     })
// });



