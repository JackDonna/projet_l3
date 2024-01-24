let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mail = document.querySelector("#form_mail").value;
    let password = document.querySelector("#form_password").value;
    let nom = document.querySelector("#form_nom").value;
    let prenom =document.querySelector("#form_prenom").value;

    let obj = {
        "nom": nom,
        "prenom": prenom,
        "mail": mail,
        "password": password
    }
    console.log("oui")
    axios.post("/sql/user/sign_up", obj).then((response) => {
        if(response.data) window.location.replace("/calendar");
    })
})