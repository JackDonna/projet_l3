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
 * Fonction pour déclencher l'animation de montée des boîtes
 */
function declencherAnimationMontee() {
    // Récupere toutes les boîtes existantes
    let boites = document.querySelectorAll(".box_absence");

    // Parcoure chaque boîte
    boites.forEach(function (boite) {
        // Ajoute la classe pour déclencher l'animation de montée
        boite.classList.add("slide-up");
    });
}

/**
 * Fonction pour ajouter une classe pour l'animation de fondu et supprimer la boîte après la fin de l'animation
 */
function supprimerBoiteAvecAnimation(p) {
    setTimeout(function () {
        // Ajoute la classe pour l'animation de fondu
        p.classList.add("fade-out");

        // Supprime la boîte après la fin de l'animation
        setTimeout(function () {
            boite.removeChild(p);
            declencherAnimationMontee(p);
        }, 500);
    }, 50);
}

/**
 * Fonction pour afficher une boîte de dialogue de confirmation avant de supprimer la boîte
 */
function confirmerAvantSuppression(p) {
    if (confirm("Voulez-vous vraiment choisir cet événement ?")) {
        supprimerBoiteAvecAnimation(p); // Supprime le paragraphe parent (la boîte) avec une animation de fade en sortie
    }
}

/**
 * function add absence in GUI by the APi RDP
 */
async function print_absence() {
    let json = await axios.get("/sql/absence/get_available_absence").then((response) => {
        console.log(response.data);
        let json = response.data;
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            let evenement = json[i];

            // Vérifie si l'événement a déjà été affiché
            if (dejaAffiche[JSON.stringify(evenement)]) {
                continue; // Passer à la prochaine itération si l'événement existe déjà
            }

            // Crée un paragraphe pour chaque donnée
            let p = document.createElement("p");
            p.classList.add("box_absence");

            // Affecte la valeur de chaque clé à chaque paragraphe
            console.log(evenement);
            p.innerHTML = `
            Motif : ${evenement.motif}<br>
            Date : ${evenement.date.split("T", 1)}<br>
            Heure du début :${evenement.heure_debut}<br>
            Heure de fin : ${evenement.heure_fin}<br>
            Professeur : ${evenement.nom} ${evenement.prenom}
         `;

            // Crée un bouton pour cacher la boîte
            let boutonV = document.createElement("button");
            boutonV.innerHTML = "✅​";
            boutonV.onclick = function () {
                confirmerAvantSuppression(p); // Afficher la confirmation avant de supprimer
            };

            // Crée un bouton pour cacher la boîte
            let boutonX = document.createElement("button");
            boutonX.innerHTML = "❌​";
            boutonX.onclick = function () {
                confirmerAvantSuppression(p); // Afficher la confirmation avant de supprimer
            };

            p.appendChild(boutonV);
            p.appendChild(boutonX);

            // Ajoute le paragraphe à la boite
            boite.appendChild(p);

            // Marque l'événement comme déjà affiché
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
