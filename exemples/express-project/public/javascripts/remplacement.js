const affichage_remplacements_prof = document.getElementById("container_remplacement");

const truncateString = (str, num) => {
    if (str.length > num) {
        return str.substring(0, num - 3) + "...";
    } else {
        return str;
    }
};

let remplacement = {
    data: [],

    printRemplacement() {
        console.log("test")
        this.data.forEach((evenement) => {
            console.log("evenement : ", evenement);
            let div1 = document.createElement("div");
            div1.classList.add("box_remplacement");
            div1.innerHTML = `test`;
            div1.innerHTML = `
                    <p><span class="cle">Date : </span>${new Date(evenement.date).toLocaleDateString()}</p>
                    <p><span class="cle">Heure de début : </span>${evenement.start.slice(0, -3).replace(":", "h")}</p>
                    <p><span class="cle">Heure de fin : </span>${evenement.end.slice(0, -3).replace(":", "h")}</p>
                    <p><span class="cle">Professeur : </span>${evenement.nom} ${evenement.prenom}</p>
                    <p><span class="cle">Matière : </span>${truncateString(evenement.libelle_court, 33)}</p>
                    <p class="classe_${evenement.id_abs}" ><span class="cle 
                    }">Classe : </span>${evenement.class}</p>
                    <p><span class="cle">Motif : </span>${evenement.motif}</p>
                `;
            affichage_remplacements_prof.appendChild(div1);
        });
    },

    clearRemplacement() {
        this.diffusionList.innerHTML = "";
    },

    init() {
        console.log("init")
        axios.get("/sql/proposition/getTeacherReplace").then((response) => {

            this.data = response.data;
            this.printRemplacement();
        });
    },

}

remplacement.init();
