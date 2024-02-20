const asyncHandler = require("express-async-handler");
const {RequestResponse} = require("./utils/object_engine");
// exports.etab_list = asyncHandler(async (req, res, next) => {
//     db.query('SELECT * FROM `Etablissement`', (err, rows, fields) => {
//         if (err) throw err
//         let obj = []
//         for(let i in rows){
//             obj.push({
//                 'id_etab' : rows[i].id_etab,
//                 'code_etab' : rows[i].code_etab,
//                 'nom' : rows[i].nom,
//                 'type' : rows[i].type,
//                 'code_postal' : rows[i].code_postal,
//                 'nom_commune' : rows[i].nom_commune,
//                 'lattitude': rows[i].lattitude,
//                 'longitude': rows[i].longitude
//         })
//         }
//         res.send(obj);
//       })
//
// });
//
// exports.etab_detail = asyncHandler(async (req, res, next) => {
//     db.query('SELECT * FROM `Etablissement` WHERE `id_etab`= ?',[req.params.id], (err, rows, fields) => {
//         if (err) throw err
//
//         res.send({
//             'id_etab' : rows[0].id_etab,
//             'code_etab' : rows[0].code_etab,
//             'nom' : rows[0].nom,
//             'type' : rows[0].type,
//             'code_postal' : rows[0].code_postal,
//             'nom_commune' : rows[0].nom_commune,
//             'lattitude': rows[0].lattitude,
//             'longitude': rows[0].longitude
//     });
// })
// })