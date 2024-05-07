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
const popUPElement = document.querySelector(".popUP");
const propositionList = popUPElement.querySelector(".propositionList .popUPList");
const remplacementList = popUPElement.querySelector(".remplacementList .popUPList");
const popUPCross = popUPElement.querySelector(".popUPCross");
const searchBar = document.querySelector(".search-input");
const popUPDiffusionElement = document.querySelector(".popUPDiffusion");
const popUPDiffusionList = popUPDiffusionElement.querySelector(".popUPDiffusionList");
const popUPDiffusionCross = document.querySelector(".popUPDiffusionCross");

// ----------------------------------------------------------------------------------------------------------------------------//
// ----GLOBALS VARIABLES ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------/

let dejaAffiche = {};

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS --------------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

const truncateString = (str, num) => {
    if (str.length > num) {
        return str.substring(0, num - 3) + "...";
    } else {
        return str;
    }
};

const logout = () => {
    window.location.href = "/logout";
};

let popUP = {
    parent: popUPElement,
    propositionList: propositionList,
    remplacementList: remplacementList,

    printProposition(link, id) {
        this.clear();
        axios.get(link + id).then((response) => {
            console.log(link);
            response.data.forEach((prof) => {
                let infoContainer = document.createElement("div");
                let infoBox = document.createElement("div");
                let buttonProposition = document.createElement("button");

                infoContainer.classList.add("infoContainerProposition");
                infoBox.classList.add("infoBoxProposition");
                buttonProposition.classList.add("buttonProposition");
                buttonProposition.innerText = "Accepter";

                infoBox.innerHTML = `${prof.nom} ${prof.prenom}`;

                buttonProposition.addEventListener("click", () => {
                    axios
                        .post("/sql/proposition/acceptProposition", {
                            teacherID: prof.id_ens,
                            propositionID: prof.id_prop,
                        })
                        .then((response) => {
                            console.log(response.data);
                            this.printRemplacement("/sql/proposition/getYourReplace/", id);
                        });
                });

                infoContainer.appendChild(infoBox);
                infoContainer.appendChild(buttonProposition);
                this.propositionList.appendChild(infoContainer);
            });
        });
    },

    printRemplacement(link, id) {
        axios.get(link + id).then((response) => {
            response.data.forEach((prof) => {
                let infoContainer = document.createElement("div");
                let infoBox = document.createElement("div");

                infoContainer.classList.add("infoContainerProposition");
                infoBox.classList.add("infoBoxProposition");

                infoBox.innerHTML = `${prof.nom} ${prof.prenom}`;

                infoContainer.appendChild(infoBox);
                this.remplacementList.appendChild(infoContainer);
            });
        });
    },

    display() {
        this.parent.classList.remove("hide");
    },
    hide() {
        this.parent.classList.add("hide");
    },

    clear() {
        this.propositionList.innerHTML = "";
        this.remplacementList.innerHTML = "";
    },
};

let popUPDiffusion = {
    parent: popUPDiffusionElement,
    diffusionList: popUPDiffusionList,

    printDiffusion(link, id) {
        this.clear();
        axios.get("/sql/diffusion/diffusionsProvisor/" + id).then((response) => {
            response.data.forEach((diffusion) => {
                let infoContainer = document.createElement("div");
                let infoBox = document.createElement("div");

                infoContainer.classList.add("infoContainerProposition");
                infoBox.classList.add("infoBoxProposition");

                infoBox.innerHTML = `${diffusion.nom} ${diffusion.prenom}`;

                infoContainer.appendChild(infoBox);
                this.diffusionList.appendChild(infoContainer);
            });
        });
    },

    display() {
        this.parent.classList.remove("hide");
    },
    hide() {
        this.parent.classList.add("hide");
    },

    clear() {
        this.diffusionList.innerHTML = "";
    },
};

function compareDate(a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
}

let list = {
    data: [],
    searched: [],
    seen: [],
    searchBar: searchBar,

    drawList() {
        this.seen = [];
        affichage_absence.innerHTML = "";
        affichage_list_diff.innerHTML = "";
        this.searched.sort(compareDate);
        this.searched.forEach((evenement) => {
            if (!this.seen.includes(evenement.id_abs)) {
                this.seen.push(evenement.id_abs);
                let div = document.createElement("div");
                div.classList.add("box_absence");

                div.innerHTML = `
                    <p><span class="cle">Date : </span>${new Date(evenement.date).toLocaleDateString()}</p>
                    <p><span class="cle">Heure de début : </span>${evenement.start.slice(0, -3).replace(":", "h")}</p>
                    <p><span class="cle">Heure de fin : </span>${evenement.end.slice(0, -3).replace(":", "h")}</p>
                    <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
                    <p><span class="cle">Matière : </span>${truncateString(evenement.libelle_court, 33)}</p>
                    <p class="classe_${evenement.id_abs}" ><span class="cle 
                    }">Classe : </span>${evenement.classe}</p>
                    <p><span class="cle">Motif : </span>${evenement.motif}</p>
                `;

                div.addEventListener("click", () => {
                    popUP.display();
                    popUP.printProposition("/sql/proposition/teacher_on_absence/", evenement.id_abs);
                    popUP.printRemplacement("/sql/proposition/getYourReplace/", evenement.id_abs);
                });

                let buttonDiffusion = document.createElement("button");
                buttonDiffusion.classList.add("buttonDiffusion");
                buttonDiffusion.innerText = "Liste\nde\nDiffusion";
                buttonDiffusion.addEventListener("click", () => {
                    popUPDiffusion.display();
                    popUPDiffusion.printDiffusion("/sql/diffusion/diffusionsProvisor/", evenement.id_abs);
                });

                affichage_list_diff.appendChild(buttonDiffusion);
                affichage_absence.appendChild(div);
            } else {
                document.querySelector(`.classe_${evenement.id_abs}`).innerHTML += ", " + evenement.classe;
            }
        });
    },

    search(string) {
        this.searched = this.data.filter(
            (absence) =>
                new Date(absence.date).toLocaleDateString().includes(string.toLowerCase()) ||
                absence.nom.toLowerCase().includes(string.toLowerCase()) ||
                absence.prenom.toLowerCase().includes(string.toLowerCase())
        );
        this.drawList();
    },
    init() {
        axios.get("/sql/teacher/getUnavailableTeachers").then((response) => {
            this.data = response.data;
            this.searched = response.data;
            this.drawList();
        });
    },
};

// ----------------------------------------------------------------------------------------------------------------------------//
// --- EVENTS LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

popUPCross.addEventListener("click", () => {
    popUP.hide();
});

popUPDiffusionCross.addEventListener("click", () => {
    popUPDiffusion.hide();
});

searchBar.addEventListener("input", () => {
    list.search(searchBar.value);
});

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

list.init();
