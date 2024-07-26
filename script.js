
var table = document.getElementById("sudokuTable");

sudokuMatrix = [];
for (let i = 0; i < 9; i++) {
    sudokuMatrix[i] = [];
}
var sudokuAlap;
var sudokuMegoldott;



function TablaKeszites() {
    table = document.getElementById('sudokuTable');
    for (let i = 0; i < 9; i++) {
        const row = table.insertRow(i);
        for (let j = 0; j < 9; j++) {
            const cell = row.insertCell(j);
            cell.contentEditable = false;
            cell.className = "feher";

            cell.addEventListener("click", () => {
                MezoErtekNoveles(i, j);
            })

            if (i % 3 == 0)
                cell.style.borderTop = '2px solid #000';
            if (j % 3 == 0)
                cell.style.borderLeft = '2px solid #000';
            if (i == 8)
                cell.style.borderBottom = '2px solid #000';
            if (j == 8)
                cell.style.borderRight = '2px solid #000';

        }
    }


}


async function adatLekeres() {


    var url = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}`;

    var response = await fetch(url);
    var data = await response.json();

    sudokuAlap = data.newboard.grids[0].value;
    sudokuMegoldott = data.newboard.grids[0].solution;



}


async function ujJatek() {
    var result = await adatLekeres();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];
            cell.className = "feher";

            if (sudokuAlap[i][j] == 0)
                cell.innerHTML = "";
            else
                cell.innerHTML = sudokuAlap[i][j];


        }
    }
    sudokuMatrix = Array.from(sudokuAlap);
    document.getElementById("kitoltes").hidden = false;
    EllenorzesGombEltuntetese();
}


function kitoltes() {
    var button = document.getElementById("search-button");
    button.hidden = false;



    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];
            cell.className = "feher";




        }
    }




    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];

            cell.innerHTML = sudokuMegoldott[i][j];
            console.log(sudokuMegoldott[i][j]);

        }
    }
    sudokuMatrix = JSON.parse(JSON.stringify(sudokuMegoldott));
    EllenorzesGombMegjelenitese();
}
function MezoErtekNoveles(row, col) {

    var table = document.getElementById("sudokuTable");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            document.getElementById("sudokuTable").rows[i].cells[j].className = "feher";
        }
    }

    if (sudokuMatrix[row][col] == 9 || sudokuMatrix[row][col] == undefined) {
        sudokuMatrix[row][col] = 1
    }
    else {
        sudokuMatrix[row][col] = sudokuMatrix[row][col] + 1;
    }

    document.getElementById("sudokuTable").rows[row].cells[col].innerHTML = sudokuMatrix[row][col];
    TeljesKitoltesEllenorzese();
}
function TeljesKitoltesEllenorzese() {

    let full = true;
    for (let i = 0; i < 9; i++) {
        if (!full)
            break;
        for (let j = 0; j < 9; j++) {
            if (sudokuMatrix[i][j] == undefined || sudokuMatrix[i][j] == 0) {
                full = false;
                break;
            }
        }
    }
    if (full) {
        console.log("Tábla kitöltve");
        EllenorzesGombMegjelenitese();
    }

}
function EllenorzesGombMegjelenitese() {

    document.getElementById("search-button").classList.remove('d-none');
}

function EllenorzesGombEltuntetese() {

    document.getElementById("search-button").classList.add('d-none');
}







function validSudoku(board) {

    hibas = false;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = board[i][j];
            // if (value !== '.') {
            if (!validRow(board, i, j, value) || !validColumn(board, i, j, value) || !validBox(board, i, j, value)) {
                // return false;
                hibas = true;
            }
            // }
        }
    }
    if (!hibas) {
        zoldreFestes();
    }
    // return true;
};


function zoldreFestes() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];


            cell.className = "zold feher-betu";



        }
    }
}

//The row function.
function validRow(board, row, col, value) {
    // j represents on column
    for (let j = 0; j < 9; j++) {
        // check if the current column matches the passed in column
        if (j !== col) {
            if (board[row][j] == value) {

                for (let j2 = 0; j2 < 9; j2++) {
                    cell = table.rows[row].cells[j2];
                    cell.className = "piros";
                }

                return false;
            }
        }
    }

    return true;
}

// The column function.
function validColumn(board, row, col, value) {
    // j represents on row
    for (let i = 0; i < 9; i++) {
        // check if the current row matches the passed in row
        if (i !== row) {
            if (board[i][col] == value) {
                for (let i2 = 0; i2 < 9; i2++) {
                    cell = table.rows[i2].cells[col];
                    cell.className = "piros";
                }

                return false;
            }
        }
    }

    return true;
}

//The sub-boxes function.
function validBox(board, row, col, value) {

    const startRow = row - (row % 3), startCol = col - (col % 3);




    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {

            if (i == row && j == col) {
                console.log("start row: " + startRow + " ,i: " + i + " ,j: " + j);
                continue;
            }

            else {


                if (board[i][j] == value) {

                    for (let i2 = startRow; i2 < startRow + 3; i2++) {
                        for (let j2 = startCol; j2 < startCol + 3; j2++) {
                            cell = table.rows[i2].cells[j2];
                            cell.className = "piros";


                        }
                    }


                    return false;
                }




            }
        }
    }

    return true;
}








search = document.getElementById("search-button");

search.addEventListener("click", () => {
    console.log("Check table");
    // CheckTable();
    validSudoku(sudokuMatrix);

})

kitoltesGomb = document.getElementById("kitoltes");

kitoltesGomb.addEventListener("click", () => {
    console.log("Tabla kitoltes");
    kitoltes();
})

ujJatekGomb = document.getElementById("uj-jatek");

ujJatekGomb.addEventListener("click", () => {
    ujJatek();
})

TablaKeszites();