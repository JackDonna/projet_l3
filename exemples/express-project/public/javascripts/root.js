const body = document.querySelector("body");
const file = document.querySelector("#file");
const number = document.querySelector("#id");
const button = document.querySelector("#button");
const form = document.querySelector("#form");

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0]; // Get the first selected file
    console.log(file);

    let data = new FormData();
    data.append("number", number.value);
    data.append("file", file);
    axios.post("/sql/event/rootInsert", data).then((response) => {
        console.log(response.data);
    });
}

form.addEventListener("submit", handleFormSubmit);
