// for delay and wait 
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

// True -> cycle present
async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    let [srcRow, srcCol] = cycleResponse;
    // Dependency -> visited, dfs visited (2D array)
    let visited = [];    // trace node visited
    let dfsVisited = []; // trace stack 

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (visited[i][j] === false) {
    //             let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
    //             // Found cycle -> return
    //             if (response == true) return true;
    //         }
    //     }
    // }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited);
    if (response === true) return Promise.resolve(true);

    return Promise.resolve(false);

}


// Coloring cells for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    let cell = document.querySelector(`.cell[rid="${srcRow}"][cid="${srcCol}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    // A1 -> [[0,1], [1,0], [5,10], .....]
    for (let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++) {
        let [nbrRow, nbrCol] = graphComponentMatrix[srcRow][srcCol][children];
        if (visited[nbrRow][nbrCol] === false) {
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrRow, nbrCol, visited, dfsVisited);
            if (response === true) {  // cycle found return
                cell.style.backgroundColor = "transparent";
                await colorPromise();

                return Promise.resolve(true);

            }

        }
        else if (visited[nbrRow][nbrCol] === true && dfsVisited[nbrRow][nbrCol] === true) {   // cycle found return
            let CyclicCell = document.querySelector(`.cell[rid="${nbrRow}"][cid="${nbrCol}"]`);

            CyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();

            CyclicCell.style.backgroundColor = "transparent";
            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);

        }
    }


    dfsVisited[srcRow][srcCol] = false;
    return Promise.resolve(false); // no cycle 

}