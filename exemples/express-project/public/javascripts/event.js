
 
let boite = document.getElementById("boite_event");
let dejaAffiche = {}; // Utilisé pour stocker les valeurs déjà affichées

async function ajouterDansBoite() {

   let json = await axios.get("/sql/absence/get_available_absence").then((response) =>
   {
      console.log(response)
      let json = response.data
      console.log(json)
      for (let i = 0; i < json.length; i++) {
         let evenement = json[i];
         
         // Vérifier si l'événement a déjà été affiché
         if (dejaAffiche[JSON.stringify(evenement)]) {
            continue; // Passer à la prochaine itération si l'événement existe déjà
         }
   
         // Créer un paragraphe pour chaque donnée
         let p = document.createElement("p");
   
         // Affecter la valeur de chaque clé à chaque paragraphe
         p.innerHTML = `
            Motif : ${evenement.motif}<br>
            Date : ${evenement.date}<br>
            Heure du début :${evenement.heure_debut}<br>
            Heure de fin : ${evenement.heure_fin}<br>
         `;
   
         // Ajouter le paragraphe à la boite
         boite.appendChild(p);
         
         // Marquer l'événement comme déjà affiché
         dejaAffiche[JSON.stringify(evenement)] = true;
      }
   });
   
}


setInterval(ajouterDansBoite, 5000);