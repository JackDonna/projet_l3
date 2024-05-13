let form = document.querySelector("#form");
let error = document.querySelector(".error")
let submitButton = document.querySelector("#submitButton")

submitButton.addEventListener("click", (e) => {
    let mail = document.querySelector("#form_mail").value;
    let password = document.querySelector("#form_password").value;
    let admin = document.querySelector("#admin").checked;
    if(admin)
    {
        axios.get("/sql/teacher/sign_in_as_admin/" + mail + "/" + password).then((response) => {
            console.log(response.data)
            if(response.data) {
                window.location.replace("/dashboard_admin");
            }
            else
            {
                error.innerText = "Erreur dans l'adresse Mail ou le mot de passe, ou le compte n'existe pas"
            }
        })
    }
    else
    {
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
    }
})
form.addEventListener("submit", (e) => {
    console.log("oui");
    e.preventDefault();
    // console.log("oui");
    // let mail = document.querySelector("#form_mail").value;
    // let password = document.querySelector("#form_password").value;
    // let admin = document.querySelector("#admin").checked;
    // if(admin)
    // {
    //     axios.get("/sql/teacher/sign_in_as_admin/" + mail + "/" + password).then((response) => {
    //         console.log(response.data)
    //         if(response.data) {
    //             window.location.replace("/dashboard_admin");
    //         }
    //         else
    //         {
    //             error.innerText = "Erreur dans l'adresse Mail ou le mot de passe, ou le compte n'existe pas"
    //         }
    //     })
    // }
    // else
    // {
    //     axios.get("/sql/teacher/sign_in/" + mail + "/" + password).then((response) => {
    //         console.log(response.data)
    //         if(response.data) {
    //             window.location.replace("/");
    //         }
    //         else
    //         {
    //             error.innerText = "Erreur dans l'adresse Mail ou le mot de passe, ou le compte n'existe pas"
    //         }
    //     })
    // }

})