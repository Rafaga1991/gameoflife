const row = 20;
const col = 40;

function setColor(matriz) {
    for (var i = 0; i < row; i++) {// cambiando el color de las células
        for (var k = 0; k < col; k++) {
            matriz[i][k].className = matriz[i][k].getAttribute('data-cell') == '0' ? 'cell' : 'cell bg-color';
        }
    }
}

function getCanCell(r, c, matriz, cellType = 1) {
    let cont = 0;

    if (c > 0) {
        if (matriz[r][c - 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (c < (col - 1)) {
        if (matriz[r][c + 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r > 0) {
        if (matriz[r - 1][c].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r > 0 && c > 0) {
        if (matriz[r - 1][c - 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r > 0 && c < (col - 1)) {
        if (matriz[r - 1][c + 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r < (row - 1) && c > 0) {
        if (matriz[r + 1][c - 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r < (row - 1) && c < (col - 1)) {
        if (matriz[r + 1][c + 1].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    if (r < (row - 1)) {
        if (matriz[r + 1][c].getAttribute('data-cell') == cellType) {
            cont++;
        }
    }

    return cont;
}

function getRandom(){
    return Math.floor(Math.random() * (10 - 1) + 1)%2;
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
            matriz[i][j].setAttribute('data-cell', matriz_tmp[i][j]);
        }
    }
}

window.onload = () => {
    let idInterval = 0;
    let cont = 0;

    var celdas = document.getElementsByClassName('cell');
    var matriz = Array(row);// creando matriz y asignando longitud de filas
    var matriz_tmp = Array(row);// creando matriz temporal y asignando longitud de filas

    var message = document.getElementsByClassName('message')[0];
    var showMessage = (text)=>{
        message.hidden = false;
        message.innerText = text;
        message.style.opacity = 1;
        setTimeout(()=>{
            let cont = 1;
            let id = setInterval(()=>{
                cont -= 0.05;
                message.style.opacity = cont;
                if(cont <= 0){
                    message.hidden = true;
                    clearInterval(id);
                }
            }, 100)
        }, 2000);
    }

    for (var i = 0; i < row; i++) {// asignado longitud de columnas a cada fila
        matriz[i] = Array(col);
        matriz_tmp[i] = Array(col);
    }

    var answer = confirm("¿Generar Células vivas aleatoriamente?");
    if(!answer){
        alert('Selecciona las células vivas y presiona enter. Puedes presionar la tecla espaciadora para reiniciar');
        showMessage('Modo Selección Iniciado');
    }else{
        showMessage('Modo Aleatorio Iniciado');
    }
    var press = false;
    for (var i = 0; i < row; i++) {// asignando elementos a cada columna
        for (var k = 0; k < col; k++) {
            matriz[i][k] = celdas[cont++];
            if(answer){
                matriz_tmp[i][k] = getRandom() ? 1 : 0;// asignando células vivas o muertas aleatoriamente
            }else{
                matriz_tmp[i][k] = 0;// asignando células muertas
                matriz[i][k].onclick = (e)=>{// asignando evento de click a células
                    if(!press){
                        if(e.target.getAttribute('data-cell') == 0){
                            e.target.setAttribute('data-cell', 1);
                        }else{
                            e.target.setAttribute('data-cell', 0);
                        }
                        setColor(matriz);
                    }else if(idInterval != 0){
                        showMessage('Primero Reinicia el Juego');
                    }
                }
            }
        }
    }

    setColor(matriz);

    var call = ()=>{
        idInterval = setInterval(() => {
            for (var i = 0; i < row; i++) {
                for (var k = 0; k < col; k++) {
                    if (matriz[i][k].getAttribute('data-cell') == 0) {// analizando las células muertas
                        if (getCanCell(i, k, matriz) == 3) {// si hay 3 células vivas vecinas entonces vive
                            matriz_tmp[i][k] = 1;
                        }
                    } else if (matriz[i][k].getAttribute('data-cell') == 1) {// analizando las células vivas
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
        }, 400)
    }

    press = false;
    window.addEventListener('keydown', (e)=>{
        if(e.keyCode == 13 && !press && !answer){
            press = true;
            showMessage('Juego Iniciado');
            call();
        }else if(idInterval != 0 && e.keyCode == 32 && press){
            clearInterval(idInterval);
            clearMatriz(matriz_tmp);
            joinMatriz(matriz, matriz_tmp);
            setColor(matriz);
            press = false;
            showMessage('Juego Reiniciado!');
        }
    })

    if(answer){
        call();
    }
}