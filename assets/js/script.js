const row = 20;
const col = 40;

function setColor(matriz) {
    for (var i = 0; i < row; i++) {// cambiando el color de las celulas
        for (var k = 0; k < col; k++) {
            matriz[i][k].className = matriz[i][k].innerHTML == '0' ? 'celda bg-white' : 'celda bg-black';
        }
    }
}

function getCanCell(r, c, matriz, cellType = 1) {
    let cont = 0;

    if (c > 0) {
        if (matriz[r][c - 1].innerText == cellType) {
            cont++;
        }
    }

    if (c < (col - 1)) {
        if (matriz[r][c + 1].innerText == cellType) {
            cont++;
        }
    }

    if (r > 0) {
        if (matriz[r - 1][c].innerText == cellType) {
            cont++;
        }
    }

    if (r > 0 && c > 0) {
        if (matriz[r - 1][c - 1].innerText == cellType) {
            cont++;
        }
    }

    if (r > 0 && c < (col - 1)) {
        if (matriz[r - 1][c + 1].innerText == cellType) {
            cont++;
        }
    }

    if (r < (row - 1) && c > 0) {
        if (matriz[r + 1][c - 1].innerText == cellType) {
            cont++;
        }
    }

    if (r < (row - 1) && c < (col - 1)) {
        if (matriz[r + 1][c + 1].innerText == cellType) {
            cont++;
        }
    }

    if (r < (row - 1)) {
        if (matriz[r + 1][c].innerText == cellType) {
            cont++;
        }
    }

    return cont;
}

function clearMatriz(matriz) {
    for (var i = 0; i < row; i++) {
        for (var k = 0; k < col; k++) {
            matriz[i][k] = 0;
        }
    }
}

function joinMatriz(matriz, matriz_tmp) {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            matriz[i][j].innerText = matriz_tmp[i][j];
        }
    }
}

window.onload = () => {

    let cont = 0;

    var celdas = document.getElementsByClassName('celda');
    var matriz = Array(row);// creando matriz y asignando longitud de filas
    var matriz_tmp = Array(row);// creando matriz temporal y asignando longitud de filas

    for (var i = 0; i < row; i++) {// asignado longitud de columnas a cada fila
        matriz[i] = Array(col);
        matriz_tmp[i] = Array(col);
    }

    for (var i = 0; i < row; i++) {// asignando elementos a cada columna
        for (var k = 0; k < col; k++) {
            matriz[i][k] = celdas[cont++];
            matriz_tmp[i][k] = 0;
        }
    }

    setColor(matriz);

    setInterval(() => {
        for (var i = 0; i < row; i++) {
            for (var k = 0; k < col; k++) {
                if (matriz[i][k].innerText == 0) {// analizando las celulas muertas
                    if (getCanCell(i, k, matriz) == 3) {// si hay 3 celulas vivas vecinas entonces vive
                        matriz_tmp[i][k] = 1;
                    }
                } else if (matriz[i][k].innerText == 1) {// analizando las celulas vivas
                    let cellLife = getCanCell(i, k, matriz);
                    if (cellLife < 2) {// si una celula viva tiene menos 2 vecinos vivos, entonces muere
                        matriz_tmp[i][k] = 0;
                    } else if (cellLife >= 2 && cellLife <= 3) {// si una celula viva tiene 2 a 3 vecinos vivos, entonces vive
                        matriz_tmp[i][k] = 1;
                    } else if (cellLife > 3) {// si una celula viva tiene más de 3 vecinos vivos, entonces muere.
                        matriz_tmp[i][k] = 0;
                    }
                }
            }
        }
        joinMatriz(matriz, matriz_tmp);// uniendo la matriz con la matriz temporal
        clearMatriz(matriz_tmp);// limpiando matriz temporal
        setColor(matriz);// insertando color de matriz
    }, 500)
}