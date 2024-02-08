let form = document.querySelector("#form");
let error = document.querySelector(".error")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mail = document.querySelector("#form_mail").value;
    let password = document.querySelector("#form_password").value;

    axios.get("/sql/teacher/sign_in/" + mail + "/" + password).then((response) => {
        console.log(response.data)
        if(response.data) {
            window.location.replace("/");
        }
        else
        {
            error.innerText = "Erreur dans l'adresse Mail ou le mot de passe, ou le compte n'existe pas"
        }
    })
})