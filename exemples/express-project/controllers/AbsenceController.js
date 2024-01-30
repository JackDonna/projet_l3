const mysql = require('mysql')
const asyncHandler = require("express-async-handler");
const db = require("./db")

function get_discipline(id_discipline)
{
    db.query(
        {
            sql: "SELECT `discipline` FROM `Ref_Discipline` WHERE `id_disc`=?",
            timeout: 10000,
            values: [id_discipline]
        },
        (err, rows, fields) => {
            if(err) console.err(err);
            return rows[0]
        }
    )
}

exports.list_absence = asyncHandler(async (req, res, next) => {
    let d_debut = req.params.debut
    let d_fin = req.params.fin
    

    db.query("SELECT * FROM Absence INNER JOIN Evenement ON Evenement.heure_debut > ? AND Evenement.heure_fin < ? AND Absence.evenement = Evenement.id_ev", [d_debut, d_fin] ,(err, rows, fields) => {
        if (err) throw err
        let obj = []
        
        for(let i in rows){
            let discipline = get_discipline(rows[i].discipline)
            obj.push({'id_abs' : rows[i].id_abs, 
            'motif' : rows[i].motif, 
            'discipline' : discipline, 
            'niveau': rows[i].niveau, 
            'classe': rows[i].classe, 
            'salle': rows[i].salle, 
            'heure_debut': rows[i].heure_debut, 
            'heure_fin': rows[i].heure_fin
        })
        }
        res.send(obj);
      })
})