const rows = 100;
const cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsGrid = document.querySelector(".cells-grid");
let addressBar = document.querySelector(".address-bar");


for (let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col");
    addressCol.innerText = i + 1;
    addressColCont.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(i + 65);
    addressRowCont.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        // Attribute for cell and row identification
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsGrid.appendChild(rowCont);
}


function addListenerForAddressBarDisplay (cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowId = i + 1;
        let colId = String.fromCharCode(j + 65);
        addressBar.value = `${colId}${rowId}`
    })
}


