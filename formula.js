// storing data on blur for cell
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if (enteredData == cellProp.value) return;

            cellProp.value = enteredData;
            // If data modified remove p-c relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
};


let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
       
       
        // if Update/change in formula -> break old P-C relation then evaluate new formula and finally make new relation
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        
        // cyclic algo(addChildToGraphComponent)
        addChildToGraphComponent(inputFormula, address);
        // check formula is cyclic or not then only evaluate 
        let cycleResponse = isGraphCyclic(graphComponentMatrix);

        if(cycleResponse) {
            // alert("Your formula is Cyclic.");
            let response = confirm("Your formula is Cyclic. Do you want to trace your path.");
            while(response) {
                // keep tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Do you want to trace cyclic path again ?");
            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        //  No cycle found -> Evaluate
        let evaluatedValue = evaluateFormula(inputFormula);
        
        // update UI and db
        setCellUiAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);

        updateChildrenCells(address);
    }
});



// cyclic algo
function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCidFromAddress(childAddress);

    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            // B1: A1 + 10
            // rid -> i, cid -> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]);            // ylw part
        }
    }
};

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCidFromAddress(childAddress);
    let uncodedFormula = formula.split(" ");
    for (let i = 0; i < uncodedFormula.length; i++) {
        let asciiValue = uncodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRidCidFromAddress(uncodedFormula[i]);
            // in parent cell push child details
            graphComponentMatrix[prid][pcid].pop();            // ylw part
        }
    }

}


function updateChildrenCells(parentAddress) {
    let [ParentCell, ParentCellProp] = getCellAndCellProp(parentAddress);
    let children = ParentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childcell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUiAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            ParentCellProp.children.push(childAddress);
        }
    }
};

function removeChildFromParent(oldFormula) {
    let childAddress = addressBar.value;
    let encodedFormula = oldFormula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let index = ParentCellProp.children.indexOf(childAddress);
            ParentCellProp.children.splice(index, 1);
        }
    }
}


function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
};


function setCellUiAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    // UI update
    cell.innerText = evaluatedValue;  
    // db update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
};