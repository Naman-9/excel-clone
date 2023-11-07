// storage
let collectedSheetDb = []; // contains all sheets db
let sheetDb = [];

{
    let addSheetBtn = document.querySelector(".sheets-add-icon");
    addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < cols; j++) {

//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             bgColor: "#000000",
//             value: "",
//             formula: "",
//             children: [],
//         }

//         sheetRow.push(cellProp);
//     }

//     sheetDb.push(sheetRow);
// }



// selectors for cell properties
let bold = document.querySelector(".bold");
    let italic = document.querySelector(".italic");
    let underline = document.querySelector(".underline");
    let fontSize = document.querySelector(".font-size-prop");
    let fontFamily = document.querySelector(".font-family-prop");
    let fontColor = document.querySelector(".font-color-prop");
    let bgColor = document.querySelector(".bg-color-prop");
    let alignment = document.querySelectorAll(".alignment");
    let leftAlign = alignment[0];
    let centerAlign = alignment[1];
    let rightAlign = alignment[2];

    let activeProp = "#d1d8e0";
    let inactiveProp = "#ecf0f1";

    // Two way binding 
    // Attach property listner
    bold.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        console.log(cell, cellProp);

        // modification

        // UI Changes
        cellProp.bold = !cellProp.bold;
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        bold.style.backgroundColor = cellProp.bold ? activeProp : inactiveProp;
    })

    italic.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        console.log(cell, cellProp);

        // modification

        // UI Changes
        cellProp.italic = !cellProp.italic;
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        italic.style.backgroundColor = cellProp.italic ? activeProp : inactiveProp;
    })

    underline.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        // modification
        // data Change
        cellProp.underline = !cellProp.underline;
        // UI Changes
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        underline.style.backgroundColor = cellProp.underline ? activeProp : inactiveProp;
    });

    fontSize.addEventListener("change", (e) => {

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        cellProp.fontSize = fontSize.value;
        cell.style.fontSize = cellProp.fontSize + "px";
        fontSize.value = cellProp.fontSize;
    })

    fontFamily.addEventListener("change", (e) => {

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        cellProp.fontFamily = fontFamily.value;
        cell.style.fontFamily = cellProp.fontFamily;
        fontFamily.value = cellProp.fontFamily;
    })

    fontColor.addEventListener("change", (e) => {

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        cellProp.fontColor = fontColor.value;
        cell.style.color = cellProp.fontColor;
        fontColor.value = cellProp.fontColor;
    })

    bgColor.addEventListener("change", (e) => {

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        cellProp.bgColor = bgColor.value;
        cell.style.backgroundColor = cellProp.bgColor;
        bgColor.value = cellProp.bgColor;
    })

    alignment.forEach((alignElem) => {
        alignElem.addEventListener("click", (e) => {

            let address = addressBar.value;
            let [cell, cellProp] = getCellAndCellProp(address);

            let alignValue = e.target.classList[0];
            cellProp.alignment = alignValue;  // data Change
            cell.style.textAlign = cellProp.alignment;  // UI changes

            switch (alignValue) {
                case "left":
                    leftAlign.style.backgroundColor = activeProp;
                    centerAlign.style.backgroundColor = inactiveProp;
                    rightAlign.style.backgroundColor = inactiveProp;
                    break;
                case "center":
                    leftAlign.style.backgroundColor = inactiveProp;
                    centerAlign.style.backgroundColor = activeProp;
                    rightAlign.style.backgroundColor = inactiveProp;
                    break;
                case "right":
                    leftAlign.style.backgroundColor = inactiveProp;
                    centerAlign.style.backgroundColor = inactiveProp;
                    rightAlign.style.backgroundColor = activeProp;
                    break;
            }
        })

    })

    let allCells = document.querySelectorAll(".cell");
    for (let i = 0; i < allCells.length; i++) {
        addListenertoAttachCellProperties(allCells[i]);
    }

    function addListenertoAttachCellProperties(cell) {
        cell.addEventListener("click", (e) => {
            let address = addressBar.value;
            let [rid, cid] = decodeRidCidFromAddress(address);
            let cellProp = sheetDb[rid][cid];

            // apply property to cell
            cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
            cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
            cell.style.textDecoration = cellProp.underline ? "underline" : "none";
            cell.style.fontSize = cellProp.fontSize + "px";
            cell.style.fontFamily = cellProp.fontFamily;
            cell.style.color = cellProp.fontColor;
            cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
            cell.style.textAlign = cellProp.alignment;


            // Apply properties(active, inactive) to UI container
            bold.style.backgroundColor = cellProp.bold ? activeProp : inactiveProp;
            italic.style.backgroundColor = cellProp.italic ? activeProp : inactiveProp;
            underline.style.backgroundColor = cellProp.underline ? activeProp : inactiveProp;
            fontSize.value = cellProp.fontSize;
            fontFamily.value = cellProp.fontFamily;
            fontColor.value = cellProp.fontColor;
            bgColor.value = cellProp.bgColor;
            switch (cellProp.alignment) {
                case "left":
                    leftAlign.style.backgroundColor = activeProp;
                    centerAlign.style.backgroundColor = inactiveProp;
                    rightAlign.style.backgroundColor = inactiveProp;
                    break;
                case "center":
                    leftAlign.style.backgroundColor = inactiveProp;
                    centerAlign.style.backgroundColor = activeProp;
                    rightAlign.style.backgroundColor = inactiveProp;
                    break;
                case "right":
                    leftAlign.style.backgroundColor = inactiveProp;
                    centerAlign.style.backgroundColor = inactiveProp;
                    rightAlign.style.backgroundColor = activeProp;
                    break;
            }

            let formulaBar = document.querySelector(".formula-bar");
            formulaBar.value = cellProp.formula;
            cell.innerText = cellProp.value;
        })
    }

    function getCellAndCellProp(address) {
        let [rid, cid] = decodeRidCidFromAddress(address);
        // access cell and storage object
        let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
        let cellProp = sheetDb[rid][cid];
        return [cell, cellProp];
    }

    function decodeRidCidFromAddress(address) {
        // address = A1
        let rid = Number((address.slice(1)) - 1);  // 1
        let cid = Number((address.charCodeAt(0)) - 65);  // A
        return [rid, cid];
    }