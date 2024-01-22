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
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'rpa'
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

      // Extraire le professeur
      let prof;
      try {
        profChamp = event.description.val.split('Professeur : ')[1];
        prof = profChamp.split('\n')[0];
      } catch (error) {
        prof = null;
      }
      

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


      // Préparer la requête SQL d'insertion
      let insertionQueryFirst = `INSERT INTO ref_discipline (discipline) VALUES (?)`;
      let insertionQuery = `INSERT INTO evenement (classe, salle, date, heure_debut, heure_fin) VALUES (?, ?, ?, ?, ?)`;
      
      // Exécuter la requête SQL d'insertion FIRST
      connection.query(insertionQueryFirst, [eventName], (err) => {
        if (err) {
          console.error('Erreur lors de l\'insertion des données :', err);
        } else {
          console.log('Données insérées avec succès !');
        }     
      });

      // Exécuter la requête SQL d'insertion
      connection.query(insertionQuery, [classe,salle,formattedDate,startDateObject,endDateObject], (err) => {
        if (err) {
          console.error('Erreur lors de l\'insertion des données :', err);
        } else {
          console.log('Données insérées avec succès !');
        }     
      });
    }
      

  //affichage des données dans le calendrier 
  res.send({"code": 1, "data" :data }) ;

  })
});


module.exports = router;