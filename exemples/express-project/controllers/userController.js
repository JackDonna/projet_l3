const mysql = require('mysql')
const asyncHandler = require("express-async-handler");

// connection àa la bdd
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rpa'
  })
  connection.connect(function (err) {
      if (err) throw err;
      console.log('connection')
  })



// liste tout les utilisateurs
exports.user_list = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `enseignant`', (err, rows, fields) => {
        if (err) throw err
        let obj = []
        for(i in rows){
            obj.push({'id_ens' : rows[i].id_ens,'mail' : rows[i].mail, 'numen' : rows[i].numen, 'nom': rows[i].nom, 'prenom': rows[i].prenom})
        }
        res.send(obj);
      })
    
});

// information pour un utilisateur
exports.user_detail = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `enseignant` WHERE `id_ens`= ?',[req.params.id], (err, rows, fields) => {
        if (err) throw err

        res.send({'id_ens' : rows[0].id_ens,'mail' : rows[0].mail, 'numen' : rows[0].numen, 'nom': rows[0].nom, 'prenom': rows[0].prenom});
      })
});

// Créer un user
exports.user_create = asyncHandler(async (req, res, next) => {
    connection.query("INSERT INTO `enseignant`(`mail`, `numen`, `nom`, `prenom`) VALUES (?,?,?,?)", 
    [req.params.mail,req.params.numen, req.params.nom, req.params.prenom],
    (err, rows, fields) => {
        if (err) throw err
        res.send(`user create OK`);
      })
      
});

// Supprime un user
exports.user_delete = asyncHandler(async (req, res, next) => {
    connection.query("DELETE FROM `enseignant` WHERE `id_ens`=?", [req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user delete OK`);
      })
});

// Modifie un user
exports.user_update = asyncHandler(async (req, res, next) => {
    connection.query("UPDATE `enseignant` SET `nom`=?,`prenom`=? WHERE `id_ens`=?", [req.params.nom,req.params.prenom, req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user update OK`);
      })
});