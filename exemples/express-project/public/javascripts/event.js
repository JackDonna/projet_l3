let json = [{
   "salle" : "401",
   "date" : "2022-10-31",
   "heure_debut": "2022-10-31T09:00:00.594Z",
   "heure_fin": "2022-10-31T10:00:00.594Z",
   },
   {
      "salle": "302",
      "date" : "2022-10-31",
      "heure_debut": "2022-12-31T11:00:00.594Z",
      "heure_fin": "2022-12-31T12:00:00.594Z",
   }];
 
let boite = document.getElementById("boite_event");
let dejaAffiche = {}; // Utilisé pour stocker les valeurs déjà affichées

function ajouterDansBoite() {
   for (let i = 0; i < json.length; i++) {
      let evenement = json[i];
      
      // Vérifier si l'événement a déjà été affiché
      if (dejaAffiche[JSON.stringify(evenement)]) {
         continue; // Passer à la prochaine itération si l'événement existe déjà
      }

      // Créer un paragraphe pour chaque donnée
      let p = document.createElement("p");

      // Convertir les dates en objets Date
      let debut = new Date(evenement.heure_debut);
      let fin = new Date(evenement.heure_fin);

      // Formater les dates pour afficher uniquement l'heure et les minutes
      let debutFormat = debut.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let finFormat = fin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

      // Affecter la valeur de chaque clé à chaque paragraphe
      p.innerHTML = `
         Salle : ${evenement.salle}<br>
         Date : ${evenement.date}<br>
         Heure du début :${debutFormat}<br>
         Heure de fin :${finFormat}<br>
      `;

      // Ajouter le paragraphe à la boite
      boite.appendChild(p);
      
      // Marquer l'événement comme déjà affiché
      dejaAffiche[JSON.stringify(evenement)] = true;
   }
}

function start() {
   setInterval(ajouterDansBoite, 1000);
}
