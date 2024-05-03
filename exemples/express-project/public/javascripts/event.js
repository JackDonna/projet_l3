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

function truncateString(str, num) {
    if (str.length > num) {
        return str.substring(0, num - 3) + '...';
    } else {
        return str;
    }
}

var list = {
    data: [],
    searched: [],

    drawList() {
        affichage_absence.innerHTML = "";
        data.forEach(evenement => {
            let div = document.createElement("div");
            div.classList.add("box_absence");

            console.log(evenement)

            div.innerHTML = `
            <p><span class="cle">Date : </span>${new Date(evenement.date).toLocaleDateString()}</p>
            <p><span class="cle">Heure de début : </span>${evenement.start.slice(0, -3).replace(":", "h")}</p>
            <p><span class="cle">Heure de fin : </span>${evenement.end.slice(0, -3).replace(":", "h")}</p>
            <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
            <p><span class="cle">Matière : </span>${truncateString(evenement.libelle_court, 33)}</p>
            <p><span class="cle">Classe : </span>${evenement.classe}</p>
            <p><span class="cle">Motif : </span>${evenement.motif}</p>
         `;

            affichage_absence.appendChild(div); 


            axios.get("/sql/diffusion/diffusionsProvisor/" + evenement.id_abs).then((response) => {

                let div_list_diff = document.createElement("div");
                div_list_diff.classList.add("list");

                let select = document.createElement("select");
                select.setAttribute("name", "prof");
                response.data.forEach(prof => {
                    let option = document.createElement("option");
                    option.setAttribute("value", prof.id_ens);
                    option.innerHTML = `${prof.nom} ${prof.prenom}`;
                    select.appendChild(option);
                })
                
                div_list_diff.appendChild(select);
                affichage_list_diff.appendChild(div_list_diff);
            })

            axios.get("/sql/proposition/teacher_on_absence/" + evenement.id_abs).then((response) => {
                let div_list_prop = document.createElement("div");
                div_list_prop.classList.add("list");

                let select = document.createElement("select");
                select.setAttribute("name", "prof");
                response.data.forEach(prof => {
                    let option = document.createElement("option");
                    option.setAttribute("value", prof.id_ens);
                    option.setAttribute("prop", prof.id_prop);
                    option.innerHTML = `${prof.nom} ${prof.prenom}`;
                    select.appendChild(option);
                })
                
                let button = document.createElement("button");
                button.innerText = "Accept"
                button.classList.add("accept");

                button.addEventListener("click", () => {
                    let option = select.options[ select.selectedIndex ];
                    if(option != undefined){
                        axios.post("/sql/proposition/acceptProposition", {teacherID: option.value, propositionID: option.getAttribute('prop')}).then((response) => {

                        });
                    }
                })

                div_list_prop.appendChild(select);
                div_list_prop.appendChild(button);
                affichage_propositions.appendChild(div_list_prop);
            })

            axios.get("/sql/proposition/getYourReplace/" + evenement.id_abs).then((response) => {
                response.data.forEach(prof => {
                    let div_list_rempl = document.createElement("div");
                    div_list_rempl.classList.add("list");
                    div_list_rempl.innerHTML = `
                    <p><span class="cle">Professeur : </span>${prof.nom} ${prof.prenom}</p>
                    `
                    affichage_remplacements.appendChild(div_list_rempl);
                })
            })
        });
    },
    init() {
        axios.get("/sql/teacher/getUnavailableTeachers").then((response) => {
            data = response.data;
            searched = response.data;
            this.drawList();
        })
    },

    
}

var count = 0;

async function print_absence() {

    await axios.get("/sql/teacher/getUnavailableTeachers").then(async (response) => {
        // console.log(response)
        let json = response.data
        console.log(json)
        // console.log(json)
        for (let i = 0; i < json.length; i++) {
            let evenement = json[i];
            console.log(evenement.id_abs)
            // Vérifier si l'événement a déjà été affiché
            if (dejaAffiche[JSON.stringify(evenement)]) {
                continue; // Passer à la prochaine itération si l'événement existe déjà
            } else {
                count++;
            }

            // Créer un paragraphe pour chaque donnée
            let div = document.createElement("div");
            div.classList.add("box_absence");

            // Affecter la valeur de chaque clé à chaque paragraphe
            // console.log(evenement)
            div.innerHTML = `
            <p><span class="cle">Motif : </span>${evenement.motif}</p>
            <p><span class="cle">Date : </span>${evenement.date.split('T', 1)}</p>
            <p><span class="cle">Heure de début : </span>${evenement.start}</p>
            <p><span class="cle">Heure de fin : </span>${evenement.end}</p>
            <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
         `;

            // Ajouter le paragraphe à la boite
            affichage_absence.appendChild(div);

            // Marquer l'événement comme déjà affiché
            dejaAffiche[JSON.stringify(evenement)] = true;

            

            let paramValue = evenement.id_abs;
            await axios.post(`/sql/diffusion/diffusionsProvisor`, {id_abs : evenement.id_abs}).then((response) => {
                console.log("ici : ")
                console.log(response.data)
            })

            div_list_diff.innerHTML = `
      <select name="prof">
         <option value="">--Liste des professeurs--</option>
         <option value="">M. Alasseur</option>
         <option value="">M. Perrod</option>
         <option value="">M. Lebourgt</option>
         <option value="">Mme. Anton</option>
         <option value="">Mme. Guillet</option>
         <option value="">Mme. Bonnard</option>
      </select>
   `;

            affichage_list_diff.appendChild(div_list_diff);
        }
    });
}

async function print_list_diff(){
   console.log("test");
   affichage_list_diff.style.background = "crimson";
   console.log("compteur : "+count);

   let div = document.createElement("div");
   div.classList.add("list");

   div.innerHTML = `
      <select name="prof">
         <option value="">--Liste des professeurs--</option>
         <option value="">M. Alasseur</option>
         <option value="">M. Perrod</option>
         <option value="">M. Lebourgt</option>
         <option value="">Mme. Anton</option>
         <option value="">Mme. Guillet</option>
         <option value="">Mme. Bonnard</option>
      </select>
   `;

   affichage_list_diff.appendChild(div);

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
// --- EVENTS LISTENERS ------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------------------------------------------------------------------------//
// --- FUNCTIONS CALLS --------------------------------------------------------------------------------------------------------//
// ----------------------------------------------------------------------------------------------------------------------------//

list.init();
