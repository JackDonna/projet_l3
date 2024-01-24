let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mail = document.querySelector("#form_mail").value;
    let password = document.querySelector("#form_password").value;

    axios.get("/sql/user/sign_in/" + mail + "/" + password).then((response) => {
        console.log(response.data)
        window.location.replace("/calendar")
    })
})