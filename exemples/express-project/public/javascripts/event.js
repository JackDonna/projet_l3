// ----------------------------------------------------------------------------------------------------------------------------//
// --- DOM ELEMENTS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const affichage_absence = document.getElementById("container_absence");

const absence = document.getElementById("absence");

const absence_logo = document.getElementById("absence_logo");

const affichage_list_diff = document.getElementById("container_list_diff");
const list_diff = document.getElementById("list_diff");

const affichage_propositions = document.getElementById("container_propositions");
const propositions = document.getElementById("propositions");

const affichage_remplacements = document.getElementById("container_remplacements");
const remplacements = document.getElementById("remplacements");

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
    let json = await axios.get("/sql/teacher/getUnavailableTeachers").then((response) => {
        console.log(response);
        let json = response.data;
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            let evenement = json[i];

            // Vérifier si l'événement a déjà été affiché
            if (dejaAffiche[JSON.stringify(evenement)]) {
                continue; // Passer à la prochaine itération si l'événement existe déjà
            }

            // Créer un paragraphe pour chaque donnée
            let div = document.createElement("div");
            div.classList.add("box_absence");

            // Affecter la valeur de chaque clé à chaque paragraphe
            console.log(evenement);
            div.innerHTML = `
            <p><span class="cle">Motif : </span>${evenement.motif}</p>
            <p><span class="cle">Date : </span>${evenement.date.split("T", 1)}</p>
            <p><span class="cle">Heure de début : </span>${evenement.heure_debut}</p>
            <p><span class="cle">Heure de fin : </span>${evenement.heure_fin}</p>
            <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
         `;

            // Ajouter le paragraphe à la boite
            affichage_absence.appendChild(div);

            // Marquer l'événement comme déjà affiché
            dejaAffiche[JSON.stringify(evenement)] = true;
        }
    });
}

absence.addEventListener("click", () => {
    absence_logo.style.display = "flex";
    affichage_list_diff.style.display = "none";
    affichage_propositions.style.display = "none";
    affichage_remplacements.style.display = "none";
});

list_diff.addEventListener("click", () => {
    absence_logo.style.display = "none";
    affichage_list_diff.style.display = "flex";
    affichage_propositions.style.display = "none";
    affichage_remplacements.style.display = "none";
});

propositions.addEventListener("click", () => {
    absence_logo.style.display = "none";
    affichage_list_diff.style.display = "none";
    affichage_propositions.style.display = "flex";
    affichage_remplacements.style.display = "none";
});

remplacements.addEventListener("click", () => {
    absence_logo.style.display = "none";
    affichage_list_diff.style.display = "none";
    affichage_propositions.style.display = "none";
    affichage_remplacements.style.display = "flex";
});

function logout() {
    window.location.href = "/logout";
}

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTES LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

print_absence();
setInterval(print_absence, 10000);
