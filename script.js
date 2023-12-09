function CreateSudokuTable() {
    table = document.getElementById('sudokuTable');
    for (let i = 0; i < 9; i++) {
        const row = table.insertRow(i);
        for (let j = 0; j < 9; j++) {
            const cell = row.insertCell(j);
            cell.contentEditable = false; // szerkesztés letiltása
            cell.className = "feher";
            // let ujsor = document.getElementById('sudokuTable').cells[j];

            // cell.style.backgroundColor = '#fff'; // Alapértelmezett háttérszín
            // cell.setAttribute('onclick', `CellClick(${i}, ${j})`);
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
var sudokuAlap;
var sudokuMegoldott;

async function adatLekeres() {


    var url = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}`;

    var response = await fetch(url);
    var data = await response.json();

    sudokuAlap = data.newboard.grids[0].value;
    sudokuMegoldott = data.newboard.grids[0].solution;

    // console.log(sudokuMegoldott);

}

var sudokuMatrix;
async function ujJatek() {
    var result = await adatLekeres();
    var table = document.getElementById("sudokuTable");
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

}


function kitoltes() {
    var button = document.getElementById("search-button");
    button.hidden = false;


    var table = document.getElementById("sudokuTable");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];

            cell.innerHTML = sudokuMegoldott[i][j];
            console.log(sudokuMegoldott[i][j]);

        }
    }
    sudokuMatrix = JSON.parse(JSON.stringify(sudokuMegoldott));
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
            if (sudokuMatrix[i][j] == undefined) {
                full = false;
                break;
            }
        }
    }
    if (full) {
        EllenorzesGombMegjelenitese();
    }

}
function EllenorzesGombMegjelenitese() {
    var button = document.getElementById("search-button");
    document.getElementById("search-button").hidden = false;
}

function CheckTable() {
    //Sor és Oszlop ellenőrzés
    sudokuCheckMatrix = Array.from({ length: 9 }, () => new Array(9).fill(true));
    for (let sor = 0; sor < 9; sor++) {
        for (let szamToCheck = 0; szamToCheck < 9; szamToCheck++) {

            for (let j = szamToCheck + 1; j < 9; j++) {
                if (sudokuMatrix[sor][szamToCheck] == sudokuMatrix[sor][j]) {
                    ok = false;
                    sudokuCheckMatrix[sor][szamToCheck] = false;
                    sudokuCheckMatrix[sor][j] = false;
                }
                if (sudokuMatrix[szamToCheck][sor] == sudokuMatrix[j][sor]) {
                    ok = false;
                    sudokuCheckMatrix[szamToCheck][sor] = false;
                    sudokuCheckMatrix[j][sor] = false;
                }
            }
        }
    }
    // Szektor ellenőrzés
    for (let sectS = 0; sectS < 3; sectS++) {
        for (let sectO = 0; sectO < 3; sectO++) {
            for (let sorToCheck = sectS * 3; sorToCheck < sectS * 3 + 3; sorToCheck++)
                for (let oszlopToCheck = sectO * 3; oszlopToCheck < sectO * 3 + 3; oszlopToCheck++) {
                    for (let sor = sectS * 3; sor < sectS * 3 + 3; sor++)
                        for (let oszlop = sectO * 3; oszlop < sectO * 3 + 3; oszlop++) {
                            if (!((sor == sorToCheck) && (oszlop == oszlopToCheck))) {
                                if (sudokuMatrix[sorToCheck][oszlopToCheck] == sudokuMatrix[sor][oszlop]) {
                                    sudokuCheckMatrix[sorToCheck][oszlopToCheck] = false;
                                    sudokuCheckMatrix[sor][oszlop] == false;
                                }
                            }
                        }
                }
        }
    }

    var table = document.getElementById("sudokuTable");

    let hibatlan = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!sudokuCheckMatrix[i][j])
                hibatlan = false;
        }
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cell = table.rows[i].cells[j];
            if (hibatlan) {

                cell.className = "zold feher-betu";


            }
            else {
                if (sudokuCheckMatrix[i][j])
                    cell.className = "feher";
                else
                    cell.className = "piros";
            }
        }
    }
}

sudokuMatrix = [];
for (let i = 0; i < 9; i++) {
    sudokuMatrix[i] = [];
}

search = document.getElementById("search-button");

search.addEventListener("click", () => {
    console.log("Check table");
    CheckTable();
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

CreateSudokuTable();