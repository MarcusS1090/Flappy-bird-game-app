const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
/* necesitaremos el contenedor del juego
 para hacerlo borroso cuando mostramos el menú final */
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png'

// Constantes del juego//

const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Variables del pajaro
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Varibales de los tubos
let pipeX = 400;
let pipeY = canvas.height - 200;

// Variables de puntaje y puntaje alto
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// vamos a adicionar una vareable booleana, entonces podemos checar cuando
//flappy pase y se incremente el valor
let scored = false;


//nos dejara controlar el pajaro con la tecla espacio
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// nos deja reiniciar el juego si hacemos ga-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})


function increaseScore() {
    //vamos a incrementar el contador cuando nuestro flaapy pase por los tubos
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // resetearemos la bandera, si el pajaro paso los tubos
    if(birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // crearemos una caja de colision para que el pajaro y los tubos

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // vamos a checar la colision con la parte de arriba de la caja de los tubos
    if(birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    //vamos a checar la colision con la parte de abajo de la caja de los tubos
    if( birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }


    // vamos comprobar si el pájaro llega a los límites
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }


    return false;
    
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');


}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    
    //esta es la manera con la que actualizaremos siempre nuestro
    //mayor puntaje al final de nuestro game, si tenemos un puntaje
    //mas alto que el anterior

    if(highScore < score) {
       highScore = score;
    }

    document.getElementById('best-score').innerHTML = highScore;
}


// vamos a reiniciar todos los valores como en el inicio para empezar
//con el pajaro al inicio
function resetGame() {
     birdX = 50;
     birdY = 50;
     birdVelocity = 0;
     birdAcceleration = 0.1;

     pipeX = 400;
     pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu(); 
}

function loop() {
    //resetea el ctx despues de cada iteracion del loop
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibuja a flappy bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // dibuja los tubos
     ctx.fillStyle = '#333';

    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //ahora vamos a necesitar adisionar colisiones para que aparezca nuestro end-menu
    // y terminar el juego

    // el collisionCheck returnara como verdadero si hemos colisionado
    // de lo contrario sera falso
    if(collisionCheck()){
        endGame();
        return;
    }

    // movemos los tubos
    pipeX -= 1.5;

    //si los tubos se mueven fuera del frame, necesitamos reiniciar los tubos
    if(pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //aplicamos gravedad al pajaro y lo dejamos mover
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    //siempre chequemos si llamamos nuestras funciones...
    increaseScore();
    requestAnimationFrame(loop);
}

loop();