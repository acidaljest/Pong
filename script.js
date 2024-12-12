// Variables globales
let posicionX, posicionY;
let velocidadX, velocidadY;
let anchoRaqueta = 5, altoRaqueta = 100;
let posicionRaquetaJugador, posicionRaquetaComputadora;
let velocidadComputadora = 4;
let puntajeJugador = 0;
let puntajeComputadora = 0;
let fondo;
let bola;
let barra1;
let barra2;
let anguloPelota = 0;
let sonidoRaqueta;
let sonidoFin;

function preload() {
    fondo = loadImage("fondo1.png");
    bola = loadImage("bola.png");
    barra1 = loadImage("barra1.png");
    barra2 = loadImage("barra2.png");
    sonidoRaqueta = loadSound("raquet.wav");
    sonidoFin = loadSound("end.wav");
}

function setup() {
    createCanvas(800, 400);

    // Posición inicial de la pelota
    posicionX = width / 2;
    posicionY = height / 2;

    // Velocidad inicial de la pelota
    velocidadX = 5;
    velocidadY = 3;

    // Posición inicial de las raquetas
    posicionRaquetaJugador = height / 2 - altoRaqueta / 1;
    posicionRaquetaComputadora = height / 2 - altoRaqueta / 1;
}

function draw() {
    background(fondo);

    // Dibujar el marco superior e inferior
    fill(color("#2B3FD6"));
    rect(0, 0, width, 10); // Marco superior
    rect(0, height - 10, width, 10); // Marco inferior

    // Dibujar la pelota con efecto de rotación
    push();
    translate(posicionX, posicionY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, 20, 20);
    pop();

    // Dibujar las raquetas
    image(barra1, 10, posicionRaquetaJugador, anchoRaqueta, altoRaqueta);
    image(barra2, width - 14, posicionRaquetaComputadora, anchoRaqueta, altoRaqueta);

    // Dibujar los puntajes
    textSize(32);
    fill(color("#2B3FD6"));
    text(puntajeJugador, width / 4, 50);
    text(puntajeComputadora, (3 * width) / 4, 50);

    // Movimiento de la pelota
    posicionX += velocidadX;
    posicionY += velocidadY;
    anguloPelota += sqrt(velocidadX * velocidadX + velocidadY * velocidadY) * 0.05;

    // Rebote en los marcos superior e inferior
    if (posicionY <= 10 || posicionY >= height - 10) {
        velocidadY *= -1;
    }

    // Rebote en la raqueta del jugador
    if (
        posicionX <= 30 &&
        posicionY > posicionRaquetaJugador &&
        posicionY < posicionRaquetaJugador + altoRaqueta
    ) {
        ajustarAnguloRaqueta(posicionY, posicionRaquetaJugador);
        velocidadX *= -1;
        sonidoRaqueta.play();
    }

    // Rebote en la raqueta de la computadora
    if (
        posicionX >= width - 30 &&
        posicionY > posicionRaquetaComputadora &&
        posicionY < posicionRaquetaComputadora + altoRaqueta
    ) {
        ajustarAnguloRaqueta(posicionY, posicionRaquetaComputadora);
        velocidadX *= -1;
        sonidoRaqueta.play();
    }

    // Verificar si la pelota sale por los lados
    if (posicionX < 0) {
        puntajeComputadora++;
        resetPelota();
        if (puntajeComputadora === 10 || puntajeJugador === 10) {
            sonidoFin.play();
        }
    } else if (posicionX > width) {
        puntajeJugador++;
        resetPelota();
        if (puntajeComputadora === 10 || puntajeJugador === 10) {
            sonidoFin.play();
        }
    }

    // Movimiento de la computadora
    if (posicionY > posicionRaquetaComputadora + altoRaqueta / 2) {
        posicionRaquetaComputadora += velocidadComputadora;
    } else if (posicionY < posicionRaquetaComputadora + altoRaqueta / 2) {
        posicionRaquetaComputadora -= velocidadComputadora;
    }

    // Movimiento de la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        posicionRaquetaJugador -= 10;
    }
    if (keyIsDown(DOWN_ARROW)) {
        posicionRaquetaJugador += 10;
    }

    // Mantener las raquetas dentro de los límites del espacio de juego con constrain
    posicionRaquetaJugador = constrain(posicionRaquetaJugador, 10, height - altoRaqueta - 10);
    posicionRaquetaComputadora = constrain(posicionRaquetaComputadora, 10, height - altoRaqueta - 10);
}

function ajustarAnguloRaqueta(posicionPelota, posicionRaqueta) {
    let distanciaCentro = (posicionPelota - (posicionRaqueta + altoRaqueta / 2)) / (altoRaqueta / 2);
    let angulo = distanciaCentro * PI / 4; // Angulo máximo de 45 grados
    let nuevaVelocidad = sqrt(velocidadX * velocidadX + velocidadY * velocidadY);
    velocidadX = nuevaVelocidad * cos(angulo) * (velocidadX > 0 ? 1 : -1);
    velocidadY = nuevaVelocidad * sin(angulo);
}

function resetPelota() {
    posicionX = width / 2;
    posicionY = height / 2;
    velocidadX *= -1;
}
