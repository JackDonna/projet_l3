const affichage_remplacements_prof = document.getElementById("container_remplacement");

let remplacement = {
    data: [],

    printRemplacement() {
        console.log("test")
        this.data.forEach((evenement) => {
            console.log("evenement : ", evenement);
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
