// DOM elements
let table = document.querySelector(".dataTable");
let actionButtons = document.querySelectorAll(".actionButton");
let colorPickerElement = document.querySelector("#colorPickerElement");
let currentlyEditingElement;

// Arrays
let tableMatrix = [[0]];

// Objects
let modes = {
    dataAddMode: {
        button: 0,
        state: false
    },
    deleteMode: {
        button: 2,
        state: false
    },
    editMode: {
        button: 3,
        state: false,
        submodes: {
            editColor: {
                button: 0,
                state: false
            },
            editBackground: {
                button: 1,
                state: false
            },
            editBorder: {
                button: 2,
                state: false
            },
        }
    }
}

// Strings
let editingStyle;

// Displays the table matrix in the console for debugging purposes
function displayMatrix() {
    tableMatrix.forEach((row, rowIndex) => {
        if(row.length === 0) {
            console.log("Empty row");
        }
        else{
            let logDisplay = "";
            row.forEach((data, dataIndex) => {
                logDisplay += `${data} `;
            });
            logDisplay += `\n`
            console.log(logDisplay);
        }
    });
}

// Clears the active styles of all buttons except the ones specified in the 'except' array
function clearButtonStyles(except = []) {
    actionButtons.forEach((button, index) => {
        let allNotEqual = true;

        except.forEach((exceptButton) => {
            if(index === exceptButton) {
                allNotEqual = false;
            }
        });

        if(allNotEqual) {
            button.classList.remove("activeButton");
        }
    });
}

// Toggles the active style of a button based on its index
function toggleButtonStyle(buttonIndex) {
    actionButtons[buttonIndex].classList.toggle("activeButton");
}

// Toggles the state of a mode and updates button styles accordingly
function toggleMode(mode) {
    let tableRows = document.querySelectorAll(".tableRow");
    let tableData = document.querySelectorAll(".tableData");

    if(mode === false){
        Object.keys(modes).forEach((m) => {
            modes[m].state = false;
        });

        Object.keys(modes.editMode.submodes).forEach((m) => {
            modes.editMode.submodes[m].state = false;
        });

        clearButtonStyles();
        return;
    }

    clearButtonStyles([modes[mode].button]);

    modes[mode].state = !modes[mode].state;
    toggleButtonStyle(modes[mode].button);

    if(modes[mode].state) {
        Object.keys(modes).forEach((m) => {
            if (m !== mode) {
                modes[m].state = false;
            }
        });
    }

    if(modes.dataAddMode.state || modes.deleteMode.state || modes.editMode.state) {
        tableRows.forEach((row) => {
            row.style.cursor = "pointer";
        });
    }

    else {
        tableRows.forEach((row) => {
            row.style.cursor = "";
        });
    }

    if(modes.deleteMode.state || modes.dataAddMode.state) {
        tableData.forEach((data) => {
            data.setAttribute("contenteditable", "false");
        });
    }

    else {
        tableData.forEach((data) => {
            data.setAttribute("contenteditable", "true");
        });
    }

    if(modes.editMode.state) {
        Object.keys(modes.editMode.submodes).forEach((m) => {
            modes.editMode.submodes[m].state = false;
        });

        actionButtons[0].innerHTML = "Text";
        actionButtons[1].innerHTML = "Background";
        actionButtons[2].innerHTML = "Border";
        
        actionButtons[0].setAttribute("onclick", "toggleSubMode('editMode', 'editColor')");
        actionButtons[1].setAttribute("onclick", "toggleSubMode('editMode', 'editBackground')");
        actionButtons[2].setAttribute("onclick", "toggleSubMode('editMode', 'editBorder')");
    }

    else {
        actionButtons[0].innerHTML = "Add Data";
        actionButtons[1].innerHTML = "Add Row";
        actionButtons[2].innerHTML = "Delete";

        actionButtons[0].setAttribute("onclick", "toggleMode('dataAddMode')");
        actionButtons[1].setAttribute("onclick", "addRow()");
        actionButtons[2].setAttribute("onclick", "toggleMode('deleteMode')");
    }
}

// Toggles the state of a submode and updates button styles accordingly
function toggleSubMode(mode, submode) {
    let tableData = document.querySelectorAll(".tableData");

    clearButtonStyles([modes[mode].submodes[submode].button, modes[mode].button]);
    modes[mode].submodes[submode].state = !modes[mode].submodes[submode].state;
    toggleButtonStyle(modes[mode].submodes[submode].button);

    if(modes[mode].submodes[submode].state) {
        for(let m in modes[mode].submodes) {
            if(m !== submode) {
                modes[mode].submodes[m].state = false;
            }
        }

        tableData.forEach((data) => {
            data.setAttribute("contenteditable", "false");
        });
    }

    else {
        tableData.forEach((data) => {
            data.setAttribute("contenteditable", "true");
        });
    }
}

// Adds a new row to the table and updates the table matrix
function addRow() {
    let currentRowId = tableMatrix.length;
    tableMatrix[currentRowId] = [];
    let cursor;
    modes.dataAddMode.state ? cursor = "style = 'cursor: pointer;'" : cursor = "";

    table.innerHTML += `<tr class="tableRow" id="row${currentRowId}" onclick=addData(${currentRowId}) ${cursor}></tr>`;

    styleRows();
}

// Adds a new data cell to a specific row in the table
function addData(rowId) {
    if(modes.dataAddMode.state) {
        let row = document.querySelector(`#row${rowId}`);

        if(tableMatrix[rowId] == undefined) {
            tableMatrix[rowId] = [0];
        }
        else {
            tableMatrix[rowId].push(tableMatrix[rowId].length);
        }

        let id = `${rowId}${tableMatrix[rowId].length - 1}`;

        row.innerHTML += `<td contenteditable="${modes.dataAddMode.state ? "false" : "true"}" spellcheck="false" class="tableData" id="data${id}" onclick="deleteEditData('${id}')">Text</td>`;

        styleData();
    }
}

// Deletes or edits a data cell based on the current mode
function deleteEditData(dataId){
    let data = document.querySelector(`#data${dataId}`);
    if(modes.deleteMode.state) {
        data.remove();
        styleData();

        tableMatrix.forEach((row, rowIndex) => {
            if(row[dataId] != undefined) {
                row.splice(dataId, 1);
            }
        });
    }

    else if(modes.editMode.state) {
        let submodes = modes.editMode.submodes;
        if(submodes.editColor.state) {
            editingStyle = "c";
        }

        else if(submodes.editBackground.state) {
            editingStyle = "b";
        }

        else if(submodes.editBorder.state) {
            editingStyle = "d";
        }

        if(submodes.editColor.state || submodes.editBackground.state || submodes.editBorder.state) {
            currentlyEditingElement = data;
            // Click on the color picker which is hidden to show the user the color picker to choose a color depending on the submode
            colorPickerElement.click();
        }
    }
}

// Styles the data cells in the table
function styleData() {
    document.querySelectorAll(".tableRow").forEach((row, rowIndex) => {
        let left = 0;
        row.querySelectorAll(".tableData").forEach((data, dataIndex) => {
            data.style.left = `${left}%`;
            left -= 0.25;
        });
    });
}

// Styles the rows in the table
function styleRows() {
    document.querySelectorAll(".tableRow").forEach((row, rowIndex) => {
        row.style.top = `-${rowIndex * 8}%`;
    });
}

// Resets the table to its initial state and clears all modes
function resetTable() {
    table.innerHTML = `<tr class="tableRow" id="row0" onclick="addData(0)"><td contenteditable="true" spellcheck="false" class="tableData" id="data00" onclick="deleteEditData('00')">Text</td></tr>`;
    tableMatrix = [[0]];
    toggleMode(false);
}

// Handles color picker input to apply styles to the currently editing element
colorPickerElement.addEventListener("input", (e) => {
    let submodes = modes.editMode.submodes;
    if(modes.editMode.state && (submodes.editColor.state || submodes.editBackground.state || submodes.editBorder.state)) {
        let color = colorPickerElement.value;

        switch(editingStyle) {
            case "c":
                currentlyEditingElement.style.color = color;
                break;
            case "b":
                currentlyEditingElement.style.background = color;
                break;
            case "d":
                currentlyEditingElement.style.border = `0.25vw solid ${color}`;
                break;
        }
    }
});

window.addEventListener("paste", (e) => {
    e.preventDefault();

    let text = (e.clipboardData || window.clipboardData).getData("text");

    let span = document.createElement("span");
    span.textContent = text;

    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
    }
});

// TODO: Add functionality to add rows from anywhere in the table (top, bottom from the selected row)