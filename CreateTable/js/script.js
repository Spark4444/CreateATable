// Selecting HTML elements
let buttonContainerElement = document.querySelector(".buttonContainer");
let tableBodyElement = document.querySelector("tbody");
let columnElements = document.querySelectorAll(".tableColumn");
let colorPickerElement = document.getElementById("colorPickerElement");
let addRowButton = document.querySelector(".addRowButton");
let addColumnButton = document.querySelector(".addColumnButton");
let deleteRowButton = document.querySelector(".deleteRowButton");
let editButton = document.querySelector(".editButton");

// Initializing variables
let TrHeight = document.querySelector(".tableColumn").getBoundingClientRect().height;
let rowId = 1;
let columnId = 1;
let currentRowId;
let answerQuestionElement;
let isDeleteMode = false;
let isEditingMode = false;
let isRowEditingMode = false;

// Function to change row editing state
function rowEditingMode() {
    if(!isEditingMode && !isRowEditingMode){
        isEditingMode = false;
        isDeleteMode = false;
        resetButtons();
        isRowEditingMode = true;
        setButtonStyle(addRowButton);
    }
    else if(isRowEditingMode){
        document.querySelector(".addRowButton").style.background="";
        isRowEditingMode = false;
    }
    else if(!isDeleteMode){
        answerQuestion = "text";
        setButtonStyle(addRowButton);
        resetButtonStyle(addColumnButton);
        resetButtonStyle(deleteRowButton);
    }
}

function addRow(column) {
    if(isRowEditingMode){
        columnElements[column].innerHTML += `<td contenteditable="true" spellcheck="false" class="tableRow row${rowId}" onclick="changeRowColor(${rowId})">Text</td>`;
        rowId++;
    }
}

// Function to add a column
function addTableColumn() {
    if(!isEditingMode){
        tableBodyElement.innerHTML += `<tr class="tableColumn" onclick="addRow(${columnId})" style="height:${TrHeight}px"></tr>`;
        columnId++;
        setTimeout(() => {
            columnElements = document.querySelectorAll(".tableColumn");
        }, 10);
    }
    else if(!isDeleteMode){
        answerQuestion = "background";
        setButtonStyle(addColumnButton);
        resetButtonStyle(addRowButton);
        resetButtonStyle(deleteRowButton);
    }
}

// Function to delete a row
function deleteTableRow(){
    if(!isEditingMode && !isDeleteMode){
        isEditingMode = false;
        isRowEditingMode = false;
        resetButtons();
        isDeleteMode = true;
        setButtonStyle(deleteRowButton);
    }
    else if(!isEditingMode && isDeleteMode){
        isDeleteMode = false;
        resetButtonStyle(deleteRowButton);
    }
    else if(!isDeleteMode){
        answerQuestion = "border";
        setButtonStyle(deleteRowButton);
        resetButtonStyle(addRowButton);
        resetButtonStyle(addColumnButton);
    }
}

// Function to edit
function editTable() {
    if(isEditingMode){
        isEditingMode = false;
        addRowButton.innerHTML = "Add Row";
        addColumnButton.innerHTML = "Add Column";
        deleteRowButton.innerHTML = "Delete";
        resetButtons();
    }
    else{
        answerQuestion = "";
        isEditingMode = true;
        isDeleteMode = false;
        isRowEditingMode = false;
        addRowButton.innerHTML = "text";
        addColumnButton.innerHTML = "background";
        deleteRowButton.innerHTML = "border";
        resetButtons();
        setButtonStyle(editButton);
    }
}

// Function to reset buttons
function resetButtons() {
    resetButtonStyle(editButton);
    resetButtonStyle(addRowButton);
    resetButtonStyle(addColumnButton);
    resetButtonStyle(deleteRowButton);
}

// Function to set button style
function setButtonStyle(button) {
    button.style.background="#036036";
}

// Function to reset button style
function resetButtonStyle(button) {
    button.style.background="";
    button.style.border="";
}

// Function to reset table
function resetTable() {
    rowId = 0;
    columnId = 0;
    tableBodyElement.innerHTML=`<tr class="tableColumn"><td contenteditable="true" spellcheck="false" class="tableRow row1" onclick="changeRowColor(1)">Text</td></tr>`;    
    isEditingMode=false;
}

// Function to save the current state as an image
function saveAsImage(){
    toggleDisplay();
    html2canvas(document.body).then(function(canvas) {
        let link = document.createElement('a');
        link.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        link.download = 'screenshot.jpg';
        link.click();
        toggleDisplay();
    }); 
}

// Function to print the current state
function printPage(){
    toggleDisplay();
    window.print();
    toggleDisplay();
}

// Function to change color of a row
function changeRowColor(rowId) {
    if(isEditingMode){
        if(answerQuestion !== ""){
            currentRowId = rowId;
            colorPickerElement.click();
        }
    }
    else if(isDeleteMode){
        currentRowId = rowId;
        document.querySelector(`.row${currentRowId}`).remove();
    }
}

// Event listener for color picker
colorPickerElement.addEventListener('change', function() {
    if(answerQuestion){
        switch(answerQuestion){
            case "text":
                document.querySelector(`.row${currentRowId}`).style.color = colorPickerElement.value;
            break;
            case "background":
                document.querySelector(`.row${currentRowId}`).style.backgroundColor = colorPickerElement.value;
            break;
            case "border":
                document.querySelector(`.row${currentRowId}`).style.border = `solid 2px ${colorPickerElement.value}`;
            break;
        }  
    }
    colorPickerElement.value = '#000000';
});

// Function to toggle display of buttons and color picker
function toggleDisplay() {
    let displayStatus = buttonContainerElement.style.display === "none" ? "" : "none";
    buttonContainerElement.style.display = displayStatus;
    colorPickerElement.style.display = displayStatus;
}

//Saving function
function saveTag() {
    let tags = tableBodyElement.innerHTML;
    let blob = new Blob([tags], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "save.txt");
}

$("input[type='file']").change(function(e) {
    var file = e.target.files[0];
    if (!file) {
        alert("Incorect file type!");
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        let contents = e.target.result;
        tableBodyElement.innerHTML = contents;
    };
    reader.readAsText(file);
});