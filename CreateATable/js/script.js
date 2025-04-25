// DOM elements
let table = document.querySelector(".dataTable");
let actionButtons = document.querySelectorAll(".actionButton");
let colorPickerElement = document.querySelector("#colorPickerElement");

// Arrays
let tableMatrix = [[0]];

// Numbers
let currentRowId = 0;

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

// Displays the table matrix in the console for debugging purposes
function displayMatrix() {
    tableMatrix.forEach((row, rowIndex) => {
        let logDisplay = "";
        row.forEach((data, dataIndex) => {
            logDisplay += `${data} `;
        });
        logDisplay += `\n`
        console.log(logDisplay);
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

    if(mode === false){
        Object.keys(modes).forEach((m) => {
            m.state = false;
        });

        Object.keys(modes.editMode.submodes).forEach((m) => {
            m.state = false;
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

    if(modes.dataAddMode.state) {
        tableRows.forEach((row) => {
            row.style.cursor = "pointer";
        });
    }

    else {
        tableRows.forEach((row) => {
            row.style.cursor = "";
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
    clearButtonStyles([modes[mode].submodes[submode].button, modes[mode].button]);
    modes[mode].submodes[submode].state = !modes[mode].submodes[submode].state;
    toggleButtonStyle(modes[mode].submodes[submode].button);

    if(modes[mode].submodes[submode].state) {
        for(let m in modes[mode].submodes) {
            if(m !== submode) {
                modes[mode].submodes[m].state = false;
            }
        }
    }
}

// Adds a new row to the table and updates the table matrix
function addRow() {
    currentRowId++;
    let cursor;
    modes.dataAddMode.state ? cursor = "style = 'cursor: pointer;'" : cursor = "";

    table.innerHTML += `<tr class="tableRow" id="row${currentRowId}" onclick=addData(${currentRowId}) ${cursor}></tr>`;
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

        row.innerHTML += `<td contenteditable="true" spellcheck="false" class="tableData" id="data${id}" onclick="deleteEditData(${id})">Text</td>`;
    }
}

// Deletes or edits a data cell based on the current mode
function deleteEditData(dataId){
    dataId = dataId.toString();
    if(dataId.length == 1) {
        dataId = `0${dataId}`;
    }

    let data = document.querySelector(`#data${dataId}`);
    if(modes.deleteMode.state) {
        data.remove();
        tableMatrix.forEach((row, rowIndex) => {
            if(row[dataId] != undefined) {
                row.splice(dataId, 1);
            }
        });
    }

    else if(modes.editMode.state) {
        // Click on the color picker which is hidden to show the user the color picker to choose a style depending on the submode
        if(modes.editMode.submodes.editColor.state && modes.editMode.state) {
            colorPickerElement.click();
        }

        else if(modes.editMode.submodes.editBackground.state && modes.editMode.state) {
            colorPickerElement.click();
        }

        else if(modes.editMode.submodes.editBorder.state && modes.editMode.state) {
            colorPickerElement.click();
        }
    }
}

// Resets the table to its initial state and clears all modes
function resetTable() {
    table.innerHTML = `<tr class="tableRow" id="row0" onclick="addData(0)"><td contenteditable="true" spellcheck="false" class="tableData" id="data00" onclick="deleteEditData('00')">Text</td></tr>`;
    tableMatrix = [[0]];
    currentRowId = 0;
    toggleMode(false);
}

colorPickerElement.addEventListener("input", (e) => {
    if(modes.editMode.state) {
        
    }
});