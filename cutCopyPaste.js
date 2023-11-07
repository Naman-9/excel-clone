// To select range we're using [ctrl + click]
// selected range =  [[top-left], [bottom-right]]  

let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;        // bool value
});

document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;        // bool value
});



for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}


let rangeStorage = [];
let cutBtn = document.querySelector(".cut");
let copyBtn = document.querySelector(".copy");
let pasteBtn = document.querySelector(".paste");



function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        // select cell range 
        if (!ctrlKey) return;

        // something already selected -- delete it and move  
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        };

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);

        console.log(rangeStorage);
    })
};

function defaultSelectedCellsUI() {
    /**
     * (2) [Array(2), Array(2)]
            0: (2) [0, 0]
            1: (2) [2, 2]
     */

    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {

    if (rangeStorage.length < 2) return;
    copyData = [];

    //             [cell][rid/cid]
    let [strow, stcol, endrow, endcol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];


    for (let i = strow; i <= endrow; i++) {
        /**
         *  | [ [],[],[] ] |     Db 
         *  | [ [],[],[] ] |
         *  | [ [],[],[] ] |
         */
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cellProp = sheetDb[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();

});

cutBtn.addEventListener("click", (e) => {

    if (rangeStorage.length < 2) return;

    //             [cell][rid/cid]
    let [strow, stcol, endrow, endcol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];

    for (let i = strow; i <= endrow; i++) {
        for (let j = stcol; j <= endcol; j++) {

            // DB
            let cellProp = sheetDb[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";

            // UI
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    defaultSelectedCellsUI();
})


pasteBtn.addEventListener("click", (e) => {
    // Past cells data work
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // Target
    let address = addressBar.value;
    let [stRow, stCol] = decodeRidCidFromAddress(address);


    // r -> refers copydata row
    // c -> refers copydata col
    for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
        for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            console.log(cell);
            if (!cell) continue;

            // DB
            console.log("----", r, c);
            let data = copyData[r][c];
            let cellProp = sheetDb[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            // UI
            cell.click();
        }
    }
})