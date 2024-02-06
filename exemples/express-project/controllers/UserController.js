const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const pool = require("./db")
const axios = require("axios")

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}

function check_user_account(mail, password, callback)
{
    pool.getConnection((err, db) =>
    {
        db.query(
            {
                sql: "SELECT * FROM Enseignant WHERE mail = ? AND PASSWORD = ?",
                timeout: 10000,
                values: [mail, password]
            },
            (err, rows, fields) => {
                if(err) callback(err, null, null);
                callback(null, rows[0]);
            }
        )
    })
}

function check_user(mail, callback)
{
    pool.getConnection((err, db) =>
    {
        db.query(
            {
                sql: "SELECT * FROM Enseignant WHERE mail = ?",
                timeout: 10000,
                values: [mail]
            },
            (err, rows, fields) => {
                if(err) callback(err, null, null);
                callback(null, rows[0]);
            }
        )
    })
}

function create_user(mail, password, nom, prenom, callback)
{
    check_user(mail, function(err, result)
    {
        if(result !== undefined)
        {
            pool.getConnection((err, db) =>
            {
                db.query(
                    {
                        sql: "INSERT INTO `Enseignant` (mail, password, nom, prenom, random_number, valide) VALUES (?,?,?,?,?,?)",
                        timeout: 10000,
                        values: [mail, password, nom, prenom, Math.round(rnd(190556, 999999)), false]
                    },
                    (err, rows, flield) => {
                        if(err) throw err;
                        callback(null,
                            {
                                nom: nom,
                                prenom: prenom,
                                mail: mail,
                                valide: false
                            });
                    }
                )
            })
        }
    })
}

exports.user_sign_in = asyncHandler( async  (req, res) => {
    // variable from parameters
    let mail = req.params.mail;
    let password = req.params.password;
    // Query bdd ( select and verify if result exist )
    check_user_account(mail, password, function(err, result)
    {
        if(err) throw err;
        if(result != undefined)
        {
            req.session.regenerate(function (err)
            {
                if (err) throw err;
                req.session.nom = result.nom;
                req.session.prenom = result.prenom;
                req.session.mail = result.mail;
                req.session.valide = result.valide;
                req.session.id_ens = result.id_ens;
                req.session.save(function (err) {
                    if (err) return next(err);
                    res.send(true);
                })
            })
        }
        else
        {
            res.send(false);
        }
    })
});


// liste tout les utilisateurs
exports.user_list = asyncHandler(async (req, res, next) => {
    pool.getConnection((err, db) =>
    {
        db.query('SELECT * FROM `Enseignant`', (err, rows, fields) => {
            if (err) throw err
            let obj = []
            for(let i in rows){
                obj.push({'id_ens' : rows[i].id_ens,'mail' : rows[i].mail, 'numen' : rows[i].numen, 'nom': rows[i].nom, 'prenom': rows[i].prenom})
            }
            res.send(obj);
        })
    })

    
});

// information pour un utilisateur
exports.user_detail = asyncHandler(async (req, res, next) => {
    pool.getConnection((err, db) =>
    {
        db.query('SELECT * FROM `Enseignant` WHERE `id_ens`= ?',[req.params.id], (err, rows, fields) => {
            if (err) throw err

            res.send({'id_ens' : rows[0].id_ens,'mail' : rows[0].mail, 'numen' : rows[0].numen, 'nom': rows[0].nom, 'prenom': rows[0].prenom});
        })
    })
});

exports.user_create = asyncHandler(async (req, res, next) => {

    create_user(req.body.mail, req.body.password, req.body.nom, req.body.prenom, function(err, result) {
        if(err) throw err;
        req.session.regenerate(function (err) {
            if (err) next(err)
            req.session.nom = result.nom;
            req.session.prenom = result.prenom;
            req.session.mail = result.mail;
            req.session.valide = false;
            axios.get("/mail/send_verif_mail/" + req.body.mail + "/" + nb_rnd);
            res.send(true);
        })
    })
});

// Supprime un user
exports.user_delete = asyncHandler(async (req, res, next) => {
    pool.getConnection((err, db) =>
    {
        db.query("DELETE FROM `Enseignant` WHERE `id_ens`=?", [req.params.id] ,(err, rows, fields) => {
            if (err) throw err
            res.send(`user delete OK`);
        })
    })
});

// Modifie un user
exports.user_update = asyncHandler(async (req, res, next) => {
    pool.getConnection((err, db) =>
    {
        db.query("UPDATE `Enseignant` SET `nom`=?,`prenom`=? WHERE `id_ens`=?", [req.params.nom,req.params.prenom, req.params.id] ,(err, rows, fields) => {
            if (err) throw err
            res.send(`user update OK`);
        })
    })
});

exports.user_verify = asyncHandler(async (req, res, next) => {
    pool.getConnection((err, db) =>
    {
        db.query("SELECT * FROM Enseignant WHERE mail = '" + req.session.mail + "'",(err, rows, fields) => {
            if(rows[0] !== undefined)
            {
                if(rows[0].random_number == req.params.number)
                {
                    db.query("update `Enseignant` set `valide` = 1 where mail = '" + req.session.mail + "'" , (err) => {
                        if (err) throw err
                        req.session.valide = 1;
                        req.session.id_ens = rows[0].id_ens;
                        res.send(true);
                    })
                }
                else
                {
                    res.send(false);
                }
            }
            else
            {
                res.send(false);
            }
        })
    })
})