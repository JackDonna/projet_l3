// ----------------------------------------------------------------------------------------------------------------------------//
// --- DOM ELEMENTS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const boite = document.getElementById("boite_event");

// ----------------------------------------------------------------------------------------------------------------------------//
// ----GLOBALS VARIABLES ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------/

let dejaAffiche = {};
let dateFilter = null;
let classeFilter = null;
let matiereFilter = null;
let Originaljson = [];
let matieres = [];
let classes = [];

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

function drawBox(evenement) {
    console.log(evenement);
    // Crée un paragraphe pour chaque donnée
    let p = document.createElement("p");
    p.classList.add("box_absence");
    // Affecte la valeur de chaque clé à chaque paragraphe
    p.innerHTML = `
        <p><span class="cle">Date : </span>${new Date(evenement.date.split("T", 1)).toLocaleDateString()}</p>
        <p><span class="cle">Heure de début : </span>${evenement.start.slice(0, -3).replace(":", "h")}</p>
        <p><span class="cle">Heure de fin : </span>${evenement.end.slice(0, -3).replace(":", "h")}</p>
        <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
        <p class="matiere_${evenement.id_mat}" ><span class="cle }">Matière : </span>${evenement.matiere}</p>
        <p class="classe_${evenement.id_abs}" ><span class="cle }">Classe : </span>${evenement.classe}</p>
     `;
    // Crée un bouton pour accepter l'offre
    let boutonV = document.createElement("button");
    boutonV.innerHTML = "✅​";
    boutonV.onclick = function () {
        confirmerAvantSuppression(p); // Afficher la confirmation avant de supprimer
        axios.post("/sql//proposition/new_proposition", { teacherID: evenement.id_ens, absenceID: evenement.id_abs }).then((response) => {
            console.log(response);
        });
    };
    // Crée un bouton pour supprimer l'offre
    let boutonX = document.createElement("button");
    boutonX.innerHTML = "❌​";
    boutonX.onclick = function () {
        confirmerAvantSuppression(p); // Afficher la confirmation avant de supprimer
        axios.post("/sql/diffusion/deleteTeacher", { teacherID: evenement.id_ens, absenceID: evenement.id_abs });
    };
    let divButtons = document.createElement("div");
    divButtons.classList.add("divButtons");
    divButtons.appendChild(boutonX);
    divButtons.appendChild(boutonV);

    // Ajoute le paragraphe à la boite
    p.appendChild(divButtons);
    boite.appendChild(p);
    // Marque l'événement comme déjà affiché
    dejaAffiche[JSON.stringify(evenement)] = true;
}

/**
 * function add absence in GUI by the APi RDP
 */
async function print_absence() {
    let json = await axios.get("/sql/diffusion/getMyDiffusion").then((response) => {
        Originaljson = response.data;
        let json = changeDataFilter(Originaljson);
        drawFilter();
        boite.innerHTML = "";
        dejaAffiche = {};
        for (let i = 0; i < json.length; i++) {
            let evenement = json[i];

            // Vérifie si l'événement a déjà été affiché
            if (dejaAffiche[JSON.stringify(evenement)]) {
                continue; // Passer à la prochaine itération si l'événement existe déjà
            }
            drawBox(evenement);
        }
    });
}
// ----------------------------------------------------------------------------------------------------------------------------//
// --- PROF FILTERS -----------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

// Récupérer le conteneur des filtres et le bouton
const filterContainer = document.getElementById("filterContainer");
const toggleButton = document.getElementById("toggleButton");

// Fonction pour basculer l'affichage du conteneur
function toggleFilters() {
    if (filterContainer.style.display === "none" || !filterContainer.style.display) {
        filterContainer.style.display = "grid";
        toggleButton.textContent = "Masquer les filtres";
    } else {
        filterContainer.style.display = "none";
        toggleButton.textContent = "Afficher les filtres";
    }
}

// Attacher l'événement click au bouton pour basculer l'affichage
toggleButton.addEventListener("click", toggleFilters);

const dateSelect = document.getElementById("dateSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const selectedFilters = document.getElementById("selectedFilters");

function updateSelection() {
    const date = dateSelect.value;
    const classValue = classSelect.value;
    const subjectValue = subjectSelect.value;

    let resultText = "Sélection : ";
    if (date) {
        resultText += ` ${date}, `;
        dateFilter = new Date(date).toDateString();
    }

    if (classValue) {
        resultText += ` ${classValue}, `;
        classeFilter = classValue;
    }

    if (subjectValue) {
        resultText += ` ${subjectValue}, `;
        matiereFilter = subjectSelect;
    }

    selectedFilters.textContent = resultText.slice(0, -2); // Remove trailing comma and space
}

// Event listeners to update selection when a filter is changed
dateSelect.addEventListener("change", updateSelection);
dateSelect.addEventListener("change", print_absence);
classSelect.addEventListener("change", updateSelection);
classSelect.addEventListener("change", print_absence);
subjectSelect.addEventListener("change", updateSelection);
subjectSelect.addEventListener("change", print_absence);

// Fonction pour vérifier si un élément n est présent dans le JSON
function elementPresentDansJSON(n, json) {
    const valeurs = Object.values(json);
    return valeurs.some((objet) => objet === n);
}

function changeDataFilter(Jsonfilter) {
    let resJson = [];
    for (let i = 0; i < Jsonfilter.length; i++) {
        let evenement = Jsonfilter[i];
        if (!elementPresentDansJSON(evenement, resJson)) {
            if (matiereFilter != null) {
                if (evenement.matiere == matiereFilter) {
                    resJson.push(evenement);
                }
            }
            if (classeFilter != null) {
                if (evenement.classe == classeFilter) {
                    resJson.push(evenement);
                }
            }
            if (new Date(evenement.date).toDateString() == dateFilter) {
                resJson.push(evenement);
            }
            if (classeFilter == null && matiereFilter == null && dateFilter == null) {
                resJson.push(evenement);
            }
        }
    }
    return resJson;
}

function drawFilter() {
    if (matieres.length == 0) {
        for (let i = 0; i < Originaljson.length; i++) {
            let evenement = Originaljson[i];
            if (!matieres.includes(evenement.matiere)) {
                matieres.push(evenement.matiere);
            }
        }
        for (let i = 0; i < matieres.length; i++) {
            let mat = matieres[i];
            let op = document.createElement("option");
            op.value = mat;
            op.innerHTML = mat;
            subjectSelect.add(op);
        }
    }
    if (classes.length == 0) {
        for (let i = 0; i < Originaljson.length; i++) {
            let evenement = Originaljson[i];
            if (!classes.includes(evenement.class)) {
                classes.push(evenement.class);
            }
        }
        for (let i = 0; i < classes.length; i++) {
            let cl = classes[i];
            let op = document.createElement("option");
            op.value = cl;
            op.innerHTML = cl;
            classSelect.add(op);
        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTES LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

print_absence();
setInterval(print_absence, 10000);
