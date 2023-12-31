// update data no need to change UI

let activeSheetColor = "#ced6e0";

let sheetFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheets-add-icon");
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");


    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);


    sheet.innerHTML = `
    <div class="sheet-content">
    Sheet ${allSheetFolders.length + 1}
  </div>
  `;

    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    //  DB for each sheet
    createSheetDb();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // 0 -> left  1 -> scroll  2-> right
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm(" your sheet will be removed permanently. Are you sure ?");
        if (response === false) return;

        let sheetId = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetDb.splice(sheetId, 1);
        collectedGraphComponent.splice(sheetId, 1);

        // UI
        handleSheetUIRemoval(sheet);

        // By default assing DB to sheet 1 
        sheetDb = collectedSheetDb[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();


    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;

}


function handleSheetDb(sheetId) {
    sheetDb = collectedSheetDb[sheetId];
    graphComponentMatrix = collectedGraphComponent[sheetId];

}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // by default click on first cell via DOM
    let firstCell = document.querySelector(".cell");  // gives 1st element
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {

    sheet.addEventListener("click", (e) => {
        let sheetId = Number(sheet.getAttribute("id"));
        handleSheetDb(sheetId);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}


function createSheetDb() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {

            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                bgColor: "#000000",
                value: "",
                formula: "",
                children: [],
            }

            sheetRow.push(cellProp);
        }

        sheetDB.push(sheetRow);

    }


    collectedSheetDb.push(sheetDB);
};

function createGraphComponentMatrix() {

    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // [] -- bcoz more than one child relation(dependency) can be there
            row.push([]);
        }
        graphComponentMatrix.push(row);

    }
    collectedGraphComponent.push(graphComponentMatrix);

}






