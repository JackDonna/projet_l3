const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const db = require("./db")
const axios = require("axios")

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}


exports.user_sign_in = asyncHandler( async  (req, res) => {
    let mail = req.params.mail;
    let password = req.params.password;
    let sql = "SELECT * FROM Enseignant WHERE mail = '" + mail + "' AND password = '" + password + "'";
    db.query(sql, (err, rows, fields) => {
        req.session.regenerate(function (err) {
            if (err) next(err)

            if(rows[0] !== undefined)
            {
                // store user information in session, typically a user id
                req.session.nom = rows[0].nom;
                req.session.prenom = rows[0].prenom;
                req.session.mail = rows[0].mail;
                req.session.valide = rows[0].valide;

                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save(function (err) {
                    if (err) return next(err)
                    res.send(true)
                })
            }
            else
            {
                res.send(false)
            }

        })
    })
});


// liste tout les utilisateurs
exports.user_list = asyncHandler(async (req, res, next) => {
    db.query('SELECT * FROM `Enseignant`', (err, rows, fields) => {
        if (err) throw err
        let obj = []
        for(let i in rows){
            obj.push({'id_ens' : rows[i].id_ens,'mail' : rows[i].mail, 'numen' : rows[i].numen, 'nom': rows[i].nom, 'prenom': rows[i].prenom})
        }
        res.send(obj);
      })
    
});

// information pour un utilisateur
exports.user_detail = asyncHandler(async (req, res, next) => {

    db.query('SELECT * FROM `Enseignant` WHERE `id_ens`= ?',[req.params.id], (err, rows, fields) => {
        if (err) throw err

        res.send({'id_ens' : rows[0].id_ens,'mail' : rows[0].mail, 'numen' : rows[0].numen, 'nom': rows[0].nom, 'prenom': rows[0].prenom});
      })
});

// Créer un user
exports.user_create = asyncHandler(async (req, res, next) => {

    let sql = "SELECT * FROM Enseignant WHERE mail = '" + req.body.mail + "'";
    db.query(sql, (err, rows) => {

            if(rows[0] === undefined)
            {
                let nb_rnd = Math.round(rnd(195631, 965239));
                // store user information in session, typically a user id
                // save the session before redirection to ensure page
                // load does not happen before session is saved
                db.query("INSERT INTO `Enseignant`(`mail`, `password`, `nom`, `prenom`, `random_number`, `valide`) VALUES (?,?,?,?,?,?)",
                    [req.body.mail,req.body.password, req.body.nom, req.body.prenom, nb_rnd.toString(), false],
                    (err) => {
                        if (err) throw err;
                        req.session.regenerate(function (err) {
                            if (err) next(err)
                            req.session.nom = req.body.nom;
                            req.session.prenom = req.body.prenom;
                            req.session.mail = req.body.mail;
                            req.session.valide = false;

                            axios.get("/mail/send_verif_mail/" + req.body.mail + "/" + nb_rnd);
                            res.send(true);
                        })


                })

            }
            else
            {
                res.send(false)
            }
    })
});

// Supprime un user
exports.user_delete = asyncHandler(async (req, res, next) => {
    db.query("DELETE FROM `Enseignant` WHERE `id_ens`=?", [req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user delete OK`);
      })
});

// Modifie un user
exports.user_update = asyncHandler(async (req, res, next) => {
    db.query("UPDATE `Enseignant` SET `nom`=?,`prenom`=? WHERE `id_ens`=?", [req.params.nom,req.params.prenom, req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user update OK`);
      })
});

exports.user_verify = asyncHandler(async (req, res, next) => {
    console.log("recu");
    db.query("SELECT * FROM Enseignant WHERE mail = '" + req.session.mail + "'",(err, rows, fields) => {
        if(rows[0] !== undefined)
        {
            if(rows[0].random_number == req.params.number)
            {
                db.query("update `Enseignant` set `valide` = 1 where mail = '" + req.session.mail + "'" , (err) => {
                    if (err) throw err
                    req.session.valide = 1;
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