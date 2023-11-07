// storage -> 2D array

let collectedGraphComponent = [];
let graphComponentMatrix = [];


// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         // [] -- bcoz more than one child relation(dependency) can be there
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

// True -> cycle present
function isGraphCyclic(graphComponentMatrix) {
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

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                // Found cycle -> return
                if (response == true) return [i, j];
            }
        }
    }
    return null;
}

// start -> visited(true) dfs(true)
// end -> dfsVisited(false)
// if visited[i][j] = true -> already explored the path, go back
// Cycle detection condition -> if (visited[i][j] == true && dfsVisited[i][j] == true) -> cycle
// return -> T/F
function dfsCycleDetection(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    // A1 -> [[0,1], [1,0], [5,10], .....]
    for (let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++) {
        let [nbrRow, nbrCol] = graphComponentMatrix[srcRow][srcCol][children];
        if (visited[nbrRow][nbrCol] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrRow, nbrCol, visited, dfsVisited);
            if (response === true) return true;  // cycle found return
        }
        else if (visited[nbrRow][nbrCol] === true && dfsVisited[nbrRow][nbrCol] === true) return true;   // cycle found return
    }


    dfsVisited[srcRow][srcCol] = false;
    return false; // no cycle 

}