let form = document.querySelector("#form");
let error = document.querySelector(".error");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mail = document.querySelector("#form_mail").value;
    let password = document.querySelector("#form_password").value;


    let obj = {
        mail: mail,
        password: password,
    };
    axios.post("/sql/teacher/sign_up", obj).then((response) => {
        console.log(response.status);
        if (response.status == 200) {
            window.location.replace("/valide_account");
        } else {
            error.innerText =
                "Erreur l'adresse mail est déjà utilisé ou les champs sont vide ou contiennent des caractères incorrectes";
        }
    });
});
