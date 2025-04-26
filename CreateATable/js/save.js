// DOM elements
let buttonContainer = document.querySelector(".buttonContainer");

// Booleans
let isSavingMode = false;

// Toggles the saving mode by hiding or showing borders and buttons
function toggleSavingMode() {
    if(!isSavingMode) {
        document.querySelectorAll(".tableRow").forEach((row) => {
            row.style.border = "none";
        });

        buttonContainer.style.display = "none";
    }
    else {
        document.querySelectorAll(".tableRow").forEach((row) => {
            row.style.border = "";
        });

        buttonContainer.style.display = "";
    }
    
    isSavingMode = !isSavingMode;
}

// Prints the current page after toggling saving mode
function printPage(){
    toggleSavingMode();
    window.print();
    toggleSavingMode();
}

// Saves the current page as an image using html2canvas
function saveAsImage(){
    toggleSavingMode();

    html2canvas(document.body).then((canvas) => {
        let image = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = image;
        link.download = "screenshot.png";
        link.click();
    });

    toggleSavingMode();
}

// Saves the table content as a JSON file
function saveAsJSON(){
    let data = JSON.stringify(table.innerHTML);
    let blob = new Blob([data], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "save.json";
    link.click();
    URL.revokeObjectURL(link.href);
}

// Opens a JSON file and loads its content into the table
function openJSON(){
    let jsonReader = document.querySelector("#jsonReader");
    jsonReader.click();

    jsonReader.addEventListener("change", (event) => {
        let file = event.target.files[0];

        if (file) {
            let reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let tableContent = JSON.parse(e.target.result);
                    table.innerHTML = tableContent;

                    styleRows();
                    styleData();
                } catch (error) {
                    console.error("Invalid JSON file:", error);
                    alert("The selected file is not a valid JSON file.");
                }
            };

            reader.readAsText(file);
        }
    });
}

// TODO: Add local storage saving and loading to save what user was working on