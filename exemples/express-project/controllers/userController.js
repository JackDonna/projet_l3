const mysql = require('mysql')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test_api'
})

connection.connect()
const asyncHandler = require("express-async-handler");

// liste tout les utilisateurs
exports.user_list = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `user`', (err, rows, fields) => {
        if (err) throw err
        let obj = []
        for(i in rows){
            obj.push({'id' : rows[i].id, 'nom' : rows[i].nom, 'prenom': rows[i].prenom})
        }
        res.send(obj);
      })
    
});

// information pour un utilisateur
exports.user_detail = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `user` WHERE `id`= ?',[req.params.id], (err, rows, fields) => {
        if (err) throw err

        res.send({'id' : rows[0].id, 'nom' : rows[0].nom, 'prenom': rows[0].prenom});
      })
});

// Créer un user
exports.user_create = asyncHandler(async (req, res, next) => {
    connection.query("INSERT INTO `user`(`nom`, `prenom`) VALUES (?,?)", [req.params.nom,req.params.prenom] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user create OK`);
      })
      
});

// Supprime un user
exports.user_delete = asyncHandler(async (req, res, next) => {
    connection.query("DELETE FROM `user` WHERE `id`=?", [req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user delete OK`);
      })
});

// Modifie un user
exports.user_update = asyncHandler(async (req, res, next) => {
    connection.query("UPDATE `user` SET `nom`=?,`prenom`=? WHERE `id`=?", [req.params.nom,req.params.prenom, req.params.id] ,(err, rows, fields) => {
        if (err) throw err
        res.send(`user update OK`);
      })
});