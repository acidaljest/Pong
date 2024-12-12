// Variables globales
let posicionX, posicionY;
let velocidadX, velocidadY;
let anchoRaqueta = 5, altoRaqueta = 100;
let posicionRaquetaJugador, posicionRaquetaComputadora;
let velocidadComputadora = 4;
let puntajeJugador = 0;
let puntajeComputadora = 0;
let fondo, imgPelota, imgRaquetaJugador, imgRaquetaComputadora;
let sonidoRaqueta, sonidoFin;
let anguloPelota = 0;
let juegoPausado = false; // Nueva variable para pausar el juego

function preload() {
    fondo = loadImage("fondo1.png");
    imgPelota = loadImage("bola.png");
    imgRaquetaJugador = loadImage("barra1.png");
    imgRaquetaComputadora = loadImage("barra2.png");
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

    // Crear botón de pausa
    let botonPausa = createButton("Pausar");
    botonPausa.position(10, height + 10);
    botonPausa.mousePressed(togglePausa);
}

function draw() {
    if (juegoPausado) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Juego en pausa", width / 2, height / 2);
        return;
    }

    background(fondo);

    // Dibujar el marco superior e inferior
    fill(color("#2B3FD6"));
    rect(0, 0, width, 10); // Marco superior
    rect(0, height - 10, width, 10); // Marco inferior

    // Dibujar la pelota con rotación
    push();
    translate(posicionX, posicionY);
    rotate(radians(anguloPelota));
    imageMode(CENTER);
    image(imgPelota, 0, 0, 20, 20);
    pop();

    // Dibujar la raqueta del jugador
    image(imgRaquetaJugador, 10, posicionRaquetaJugador, anchoRaqueta, altoRaqueta);

    // Dibujar la raqueta de la computadora
    image(imgRaquetaComputadora, width - 14, posicionRaquetaComputadora, anchoRaqueta, altoRaqueta);

    // Dibujar los puntajes
    textSize(32);
    fill(color("#2B3FD6"));
    text(puntajeJugador, width / 4, 50);
    text(puntajeComputadora, (3 * width) / 4, 50);

    // Movimiento de la pelota
    posicionX += velocidadX;
    posicionY += velocidadY;

    // Ajustar rotación de la pelota según la velocidad
    anguloPelota += velocidadX;

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
        narrarMarcador();
        resetPelota();
    } else if (posicionX > width) {
        puntajeJugador++;
        narrarMarcador();
        resetPelota();
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
    if (puntajeJugador >= 10 || puntajeComputadora >= 10) {
        sonidoFin.play();
        noLoop(); // Detener el juego cuando alguien gane
    }
}

function narrarMarcador() {
    let mensaje = `El marcador es ${puntajeJugador} a ${puntajeComputadora}`;
    let narrador = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(narrador);
}

function togglePausa() {
    juegoPausado = !juegoPausado;
}

