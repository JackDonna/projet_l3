// ----------------------------------------------------------------------------------------------------------------------------//
// --- DOM ELEMENTS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//
 
const boite = document.getElementById("boite_event");

// ----------------------------------------------------------------------------------------------------------------------------//
// ----GLOBALS VARIABLES ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------/

let dejaAffiche = {};

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS --------------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

/**
 * function add absence in GUI by the APi RDP
 */
async function print_absence() {

   let json = await axios.get("/sql/teacher/getUnavailableTeachers").then((response) =>
   {
      console.log(response)
      let json = response.data.data
      console.log(json)
      for (let i = 0; i < json.length; i++) {
         let evenement = json[i];
         
         // Vérifier si l'événement a déjà été affiché
         if (dejaAffiche[JSON.stringify(evenement)]) {
            continue; // Passer à la prochaine itération si l'événement existe déjà
         }
   
         // Créer un paragraphe pour chaque donnée
         let p = document.createElement("p");
         p.classList.add("box_absence");
   
         // Affecter la valeur de chaque clé à chaque paragraphe
         console.log(evenement)
         p.innerHTML = `
            Motif : ${evenement.motif}<br>
            Date : ${evenement.date.split('T',1)}<br>
            Heure du début : ${evenement.heure_debut}<br>
            Heure de fin : ${evenement.heure_fin}<br>
            Professeur : ${evenement.nom} ${evenement.prenom}
         `;
   
         // Ajouter le paragraphe à la boite
         boite.appendChild(p);
         
         // Marquer l'événement comme déjà affiché
         dejaAffiche[JSON.stringify(evenement)] = true;
      }
   });
   
}

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTES LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

print_absence();
setInterval(print_absence, 10000);