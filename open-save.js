let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Download file
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDb, graphComponentMatrix]);
    let file = new Blob([jsonData], {type: "application.json"})

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
});

// upload(Open) File
openBtn.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute('type', "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            // default sheet will be created
            addSheetBtn.click();

            // sheet Db, graphComponent
            sheetDb = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            collectedSheetDb[collectedSheetDb.length -1] = sheetDb; 
            collectedGraphComponent[collectedGraphComponent.length -1] = graphComponentMatrix;
            
            handleSheetProperties();
            
        })
    })
});