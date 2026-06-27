document.addEventListener("DOMContentLoaded", function() {

    // ================================================================
    //                     TUTORIAL DEL JUEGO
    // ================================================================
    const params = new URLSearchParams(window.location.search);
    const modoTutorialJuego = params.get("tutorial") === "1";

    let tutorialPasoJuego = 0;
    let tutorialActivo = false;
    let tutorialTimerPausado = false;
    window.tutorialTimerPausado = false;

    // Control: pausar / reanudar el temporizador
    window.pauseTimer = function() {
        window.tutorialTimerPausado = true;
    };

    window.resumeTimer = function() {
        window.tutorialTimerPausado = false;
    };

    if (modoTutorialJuego) {
        tutorialActivo = true;
        iniciarTutorialJuego();
    }

    function iniciarTutorialJuego() {
        pauseTimer();
        bloquearTeclado();
        crearCajaTutorialJuego();
        mostrarMensajeTutorialJuego(
            "Bienvenido al tutorial del juego.\n\n" +
            "Aprenderás cómo escribir las letras resaltadas correctamente."
        );
    }

    function avanzarTutorialJuego() {
        resumeTimer();
        tutorialPasoJuego++;

        if (tutorialPasoJuego === 1) {
            mostrarMensajeTutorialJuego(
                "La letra resaltada indica qué dedo usar.\n\n" +
                "Fijate en la guía de colores debajo del teclado."
            );
        }
        else if (tutorialPasoJuego === 2) {
            mostrarMensajeTutorialJuego(
                "Si presionás una letra incorrecta, aparecerá un aviso."
            );
        }
        else if (tutorialPasoJuego === 3) {
            mostrarMensajeTutorialJuego(
                "Cuando completes una palabra, se generará otra nueva automáticamente."
            );
        }
        else if (tutorialPasoJuego === 4) {
            mostrarMensajeTutorialJuego(
                "¡Perfecto! Al continuar, comenzará el juego real."
            );
        }
        else if (tutorialPasoJuego === 5) {
            terminarTutorial();
        }
    }

    function terminarTutorial() {
        tutorialActivo = false;
        resumeTimer();
        desbloquearTeclado();
        document.removeEventListener("keydown", bloquearEvento, true)

        const box = document.getElementById("tutorialBoxJuego");
        if (box) box.remove();

        iniciarJuegoReal();
    }

    function crearCajaTutorialJuego() {
        let div = document.createElement("div");
        div.id = "tutorialBoxJuego";
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.left = "20px";
        div.style.width = "420px";
        div.style.background = "rgba(0,0,0,0.85)";
        div.style.color = "yellow";
        div.style.padding = "20px";
        div.style.borderRadius = "10px";
        div.style.fontSize = "20px";
        div.style.whiteSpace = "pre-line";
        div.style.zIndex = "999999";

        let msg = document.createElement("div");
        msg.id = "msgJuego";
        div.appendChild(msg);

        let btn = document.createElement("button");
        btn.id = "btnNextJuego";
        btn.innerText = "Continuar";
        btn.style.marginTop = "15px";
        btn.style.fontSize = "18px";
        btn.style.padding = "10px 15px";
        btn.onclick = avanzarTutorialJuego;
        div.appendChild(btn);

        document.body.appendChild(div);
    }

    function mostrarMensajeTutorialJuego(texto) {
        pauseTimer();
        const msg = document.getElementById("msgJuego");
        msg.innerText = texto;
    }

    function bloquearTeclado() {
        document.addEventListener("keydown", bloquearEvento, true);
    }

    function desbloquearTeclado() {
        document.removeEventListener("keydown", bloquearEvento, true);
    }

    function bloquearEvento(e) {
        if (tutorialActivo) e.stopImmediatePropagation();
    }

    // Cuando termina el tutorial, acá arranca tu juego:
    function iniciarJuegoReal() {
        cambiarPalabra();
        keydownHandler = teclapresionada;
        document.addEventListener("keydown", keydownHandler);
    }


    // ================================================================
    //                     TU JUEGO ORIGINAL
    // ================================================================

    var posicionActual = 0;
    let points = document.getElementById('puntos');
    const puntosEl = document.getElementById('puntos');
    const pantallaEl = document.getElementById('pantalla');
    const texto_completadoEl = document.getElementById("texto_completado");
    const msgFinalEl = document.getElementById('mensaje-final');

    points.innerText = '0';

    let juegoTerminado = false;
    let puntajeGuardado = false;
    let keydownHandler;

    async function guardarPuntaje() {
        if (puntajeGuardado) return;
        puntajeGuardado = true;

        const user = JSON.parse(localStorage.getItem('user'));
        const puntos = parseInt(puntosEl.innerText || '0', 10);
        
        const tiemposeleccionado = localStorage.getItem("tiemposeleccionado");
        let duracion = "";

        if(tiemposeleccionado === "10") duracion = "10 segundos";
        else if (tiemposeleccionado === "240") duracion = "4 minutos";
        else if (tiemposeleccionado === "480") duracion = "8 minutos";
        else duracion = "Desconocido";
        
        const dificultad = localStorage.getItem("dificultadSeleccionada");

        try {
            await window.api.saveScore({ user_id: user.id, puntos, duracion, dificultad });
        } catch (err) {
            console.error('Error guardado puntaje', err);
            alert('No se pudo guardar el puntaje.');
        }
    }

    function generarPalabraAleatoria(){
        var longitud = Math.floor(Math.random()* 32 ) + 2;
        var caracteres = 'abcdefghijklmnopqrstuvwxyz';
        var palabraAleatoria = '';

        for (var i = 0; i < longitud; i++) {
            var indiceCaracter = Math.floor(Math.random() * caracteres.length);
            palabraAleatoria += caracteres.charAt(indiceCaracter);
        }

        return palabraAleatoria;
    }

    function cambiarPalabra(){
        var palabraAleatoria = generarPalabraAleatoria();
        pantallaEl.innerText = palabraAleatoria;
        posicionActual = 0;
        resaltarLetra();
    }

    window.pasarASiguienteLetra = function() {
        var contenidoPantalla = pantallaEl.innerText;

        if(posicionActual < contenidoPantalla.length - 1) {
            posicionActual++;
            resaltarLetra();
        }
        else {
            texto_completadoEl.innerText += contenidoPantalla + " ";
            cambiarPalabra();
        }

        if(typeof reiniciarContadorTecla === "function") {
            reiniciarContadorTecla();
        }
    };

    function resaltarLetra() {
        var contenidoPantalla = pantallaEl.innerText;
        var LetraActual = contenidoPantalla.charAt(posicionActual);
        var colorClase;
    
        var colorPorLetra = {
            'q': 'letra-color q-color',
            'w': 'letra-color w-color',
            'e': 'letra-color e-color',
            'r': 'letra-color r-color',
            't': 'letra-color y-color',
            'y': 'letra-color y-color',
            'u': 'letra-color u-color',
            'i': 'letra-color i-color',
            'o': 'letra-color o-color',
            'p': 'letra-color o-color',
            'a': 'letra-color q-color',
            's': 'letra-color w-color',
            'd': 'letra-color e-color',
            'f': 'letra-color r-color',
            'g': 'letra-color y-color',
            'h': 'letra-color y-color',
            'j': 'letra-color u-color',
            'k': 'letra-color i-color',
            'l': 'letra-color o-color',
            'z': 'letra-color q-color',
            'x': 'letra-color w-color',
            'c': 'letra-color e-color',
            'v': 'letra-color r-color',
            'b': 'letra-color y-color',
            'n': 'letra-color y-color',
            'm': 'letra-color u-color'
        };
    
        colorClase = colorPorLetra[LetraActual];
    
        if (colorClase) {
            var letraResaltada = '<span class="' + colorClase + '">' + LetraActual + '</span>';
            pantallaEl.innerHTML =
                contenidoPantalla.slice(0, posicionActual) +
                letraResaltada +
                contenidoPantalla.slice(posicionActual + 1);
        }
    }

    function sumarPuntos(cuanto) {
        const actual = parseInt(puntosEl.innerText || '0', 10);
        puntosEl.innerText = actual + cuanto;
    }
    
    function teclapresionada(event) {

        if (juegoTerminado) return;

        let teclaPresionada = event.key;
        var contenidoPantalla = pantallaEl.innerText;

        if(teclaPresionada === contenidoPantalla.charAt(posicionActual)) {

            sumarPuntos(5);
            posicionActual++;

            if (posicionActual === contenidoPantalla.length) {
                texto_completadoEl.innerText += contenidoPantalla + ' ';
                sumarPuntos(10);
                cambiarPalabra();
            } else {
                resaltarLetra(teclaPresionada);
            }

            if (typeof reiniciarContadorTecla === 'function') {
                reiniciarContadorTecla();
            }

        } else {
            alert("tecla incorrecta, pruebe de nuevo");

            if (typeof reiniciarContadorTecla === "function") {
                reiniciarContadorTecla();
            }
        }
    }    

    async function endGame() {
        if (juegoTerminado) return;
        juegoTerminado = true;

        document.removeEventListener('keydown', keydownHandler);

        const puntos = parseInt(puntosEl.innerText || "0", 10);
        const user = JSON.parse(localStorage.getItem('user'));

        await guardarPuntaje();

        try {
            const prevScores = await window.api.getUserScore(user.id);
            const maxScore = Math.max(...prevScores.map(s => s.puntos), 0);

            if(puntos >= maxScore) {
                alert(`🎉¡NUEVO PUNTAJE MAXIMO!\n\nTu Puntaje: ${puntos}`);
            } else {
                alert(`⏱️La partida ha finalizado.\n\nTu Puntaje: ${puntos}`);
            }

            window.location.href = "index.html";

        } catch (err) {
            console.error("Error obteniendo puntajes:", err);
        }
    }

    window.onTimeFinished = endGame;

    if(!modoTutorialJuego) {
        cambiarPalabra();
        document.addEventListener("keydown", teclapresionada)
    }

});
