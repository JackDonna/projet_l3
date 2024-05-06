self.addEventListener("fetch", (event) => {
    console.log(`Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
    console.log("test")
})