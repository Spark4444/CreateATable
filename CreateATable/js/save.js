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
    let data = `${JSON.stringify(table.innerHTML)} \n ${JSON.stringify(tableMatrix)}`;
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
                    let result = e.target.result;
                    let indexOfLastNewline = result.lastIndexOf("\n");
                    let tableContent = JSON.parse(result.substring(0, indexOfLastNewline));
                    let tableMatrixContent = JSON.parse(result.substring(indexOfLastNewline + 1));
                    table.innerHTML = tableContent;
                    tableMatrix = tableMatrixContent;

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

// Saves the current table content to local storage
window.addEventListener("beforeunload", (event) => {
    saveToLocalStorage("tableContent", table.innerHTML);
    saveToLocalStorage("tableMatrix", JSON.stringify(tableMatrix));
});

// Loads the table content from local storage when the page is loaded
window.addEventListener("load", () => {
    let savedContent = getFromLocalStorage("tableContent");
    if (savedContent) {
        table.innerHTML = savedContent;
        styleRows();
        styleData();
    }

    let savedMatrix = getFromLocalStorage("tableMatrix");

    tableMatrix = savedMatrix ? JSON.parse(savedMatrix) : tableMatrix;

    document.querySelectorAll(".tableRow").forEach((row) => {
        row.style.cursor = "";
    });

    document.querySelectorAll(".tableData").forEach((data) => {
        data.setAttribute("contenteditable", "true");
    });
});