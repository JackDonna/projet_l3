const express = require('express');
const router = express.Router();
const axios = require("axios");
const utils = require('./utils/ics_utils');
const ical = require('ical');
const mysql = require('mysql');

/* GET event listing in SQL base (event from emploi_du_temps) */
router.post("/download", (req, res) => {
  let url = req.body.url;
  axios.get(url, {responseType: 'blob'}).then( (response) => {
    data = utils.parseICSURL(response.data, ical);
    var connection = mysql.createConnection({
      host     : 'rdp.dptinfo-usmb.fr',
      port     : 3306,
      user     : 'app',
      password : 'POecfwI((xAEmA!T',
      database : 'RPA'
    });
    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    });

    for (let event of data) {
      // Récupérer les données du fichier JSON (data)
      let eventName = event.title;

      let startDateObject = new Date(event.start);
      let endDateObject = new Date(event.end)
      
      // Extraire la date au format 'YYYY-MM-DD'
      let formattedDate = startDateObject.toISOString().split('T')[0];
      

      // Extraire la salle
      let salle;
      try {
        salleChamp = event.description.val.split('Salle : ')[1];
        salle = salleChamp.split('\n')[0];
      } catch (error) {
        salle = null;
      }
      

      // Extraire la classe
      let classe;
      try {
        classeChamp = event.description.val.split('Classe : ')[1];
        classe = classeChamp.split('\n')[0];
      } catch (error) {
        classe = null;
      }

      // Extraire la classe
      let niveau;
      try {
        niveauChamp = event.description.val.split('Classe : ')[1];
        niveau = classeChamp.split(' ')[0];
      } catch (error) {
        niveau = null;
      }


      // Préparer la requête SQL d'insertion
      let insertionQuerydiscipline = `INSERT INTO Ref_Discipline (discipline) VALUES (?)`;
      let insertionQuery = `INSERT INTO Evenement (discipline, niveau, classe, salle, date, heure_debut, heure_fin, enseignant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      let researchName = 'SELECT `id_disc` FROM `Ref_Discipline` WHERE `discipline` = ?'


      // Exécuter la requête SQL d'insertion Discipline
      connection.query(insertionQuerydiscipline, [eventName], (err) => {
        if (err) {
          //console.error('Erreur lors de l\'insertion des données :', err);
        } else {
          console.log('Données insérées avec succès !');
        }     
      });

      // Exécuter la requête SQL d'insertion ReserachName
      connection.query(researchName, [eventName], (err, rows) => {
        if (err) {
          //console.error('Erreur lors de l\'insertion des données :', err);
        } else {
          let Myid  = rows[0].id_disc;
          // Exécuter la requête SQL d'insertion
          connection.query(insertionQuery, [Myid,niveau,classe,salle,formattedDate,startDateObject,endDateObject, req.session.id], (err) => {
            if (err) {
              //console.error('Erreur lors de l\'insertion des données :', err);
            } else {
              //console.log('Données insérées avec succès !');
            }     
          });  
          }     
      });


    }
      

  //affichage des données dans le calendrier 
  res.send({"code": 1, "data" :data }) ;

  })
});


module.exports = router;