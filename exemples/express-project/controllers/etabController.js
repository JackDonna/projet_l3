const mysql = require('mysql')
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

const asyncHandler = require("express-async-handler");

// liste tout les utilisateurs
exports.etab_list = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `etab_sco_savoie`', (err, rows, fields) => {
        if (err) throw err
        let obj = []
        for(i in rows){
            obj.push({
                'id' : rows[i].id, 
                'nom' : rows[i].nom, 
                'cp': rows[i].cp,
                'commune': rows[i].commune,
                'lat': rows[i].lat,
                'lon': rows[i].lon,
                'nature': rows[i].nature
        })
        }
        res.send(obj);
      })
    
});

// information pour un utilisateur
exports.etab_detail = asyncHandler(async (req, res, next) => {
    connection.query('SELECT * FROM `etab_sco_savoie` WHERE `id`= ?',[req.params.id], (err, rows, fields) => {
        if (err) throw err

        res.send({
            'id' : rows[0].id, 
            'nom' : rows[0].nom, 
            'cp': rows[0].cp,
            'commune': rows[0].commune,
            'lat': rows[0].lat,
            'lon': rows[0].lon,
            'nature': rows[0].nature
    });
      })
})