const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const db = require("./db")
const axios = require("axios")


exports.user_sign_in = asyncHandler( async  (req, res) => {
    let mail = req.params.mail;
    let password = req.params.password;
    let sql = "SELECT * FROM Enseignant WHERE mail = '" + mail + "' AND password = '" + password + "'";
    db.query(sql, (err, rows, fields) => {
        req.session.regenerate(function (err) {
            if (err) next(err)

            // store user information in session, typically a user id
            req.session.user = rows[0].prenom;
            req.session.mail = rows[0].mail;

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return next(err)
                axios.get("/mail/sendmail/" + mail);
            })
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
    db.query("INSERT INTO `Enseignant`(`mail`, `numen`, `nom`, `prenom`) VALUES (?,?,?,?)", 
    [req.params.mail,req.params.numen, req.params.nom, req.params.prenom],
    (err, rows, fields) => {
        if (err) throw err

        res.send(`user create OK`);
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