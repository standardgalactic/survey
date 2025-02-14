document.getElementById("surveyForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let data = Object.fromEntries(formData.entries());
    data.minecraft = formData.has("minecraft");
    data.keen = formData.has("keen");
    data.minesweeper = formData.has("minesweeper");
    data.sgaOnly = formData.has("sgaOnly");

    document.body.classList.add("glitch");

    fetch("https://api.github.com/repos/standardgalactic/survey/dispatches", {
        method: "POST",
        headers: { 
            "Accept": "application/vnd.github.everest-preview+json",
            "Authorization": `Bearer YOUR_GITHUB_TOKEN`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            event_type: "survey_submission",
            client_payload: data
        }),
    })
    .then(response => response.json())
    .then(response => {
        document.body.classList.remove("glitch");
        if (response.error) {
            document.getElementById("status").textContent = "Sorry, you have already submitted a response.";
        } else {
            document.getElementById("status").textContent = "Survey submitted! Thank you for participating.";
        }
    })
    .catch(error => {
        document.body.classList.remove("glitch");
        document.getElementById("status").textContent = "Error submitting survey.";
        console.error("Error:", error);
    });
});
