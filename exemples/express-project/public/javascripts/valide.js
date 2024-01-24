let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  let number = form.querySelector("#form_code").value
  e.preventDefault();

  axios.get("/sql/user/verifie_user/" + number).then((response) => {
    if(response.data) window.location.replace("/calendar")
  })
})