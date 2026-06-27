document.addEventListener("DOMContentLoaded", function() {
    console.log("Dificultad seleccionada:", localStorage.getItem("dificultadSeleccionada"));
    console.log("Tiempo seleccionado:", localStorage.getItem("tiemposeleccionado"));
    const tiempoElemento = document.getElementsByClassName('contador')[0];
    let cuentaregresiva;

    let tiemposeleccionado = localStorage.getItem('tiemposeleccionado');
    console.log("tiempo seleccionado:", tiemposeleccionado);

    if (tiemposeleccionado === "10"){
        cuentaregresiva = 10;
    } else if (tiemposeleccionado === "240"){
        cuentaregresiva = 240;
    } else if (tiemposeleccionado === "480"){
        cuentaregresiva = 480;
    }

    console.log("Cuenta regresiva inicial:", cuentaregresiva);
        // Verifica si cuentaregresiva es un número válido
    if (isNaN(cuentaregresiva)) {
        console.error("Error: tiempo seleccionado no válido");
        return;
    }

    window.tutorialTimerPausado = false;

    function actualizarcontador() {

        if (window.tutorialTimerPausado) return;
        
        const minutos = Math.floor(cuentaregresiva/60);
        const segundos = cuentaregresiva % 60;

        const formatotiempo = minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2,'0');
        tiempoElemento.textContent = formatotiempo;

        if(cuentaregresiva === 0) {
            clearInterval(interval);
            tiempoElemento.textContent = "00:00";
            
            if(typeof window.onTimeFinished === "function") {
                window.onTimeFinished();
            }
        } else {
            cuentaregresiva--;
        }
    }   

    const interval = setInterval(actualizarcontador, 1000);

    actualizarcontador();

    let intervaloTecla;
    let cuentaTecla;
    var dificultadSeleccionada = localStorage.getItem('dificultadSeleccionada');


    function iniciarContadorTecla() {
        
        clearInterval(intervaloTecla);
        cuentaTecla = obtenerTiempoPorDificultad();
        
        intervaloTecla = setInterval(function() {
            cuentaTecla--; // Decrementar el contador de tecla

            if (cuentaTecla === 0) {
                // Aquí puedes realizar cualquier acción necesaria cuando se acaba el tiempo para presionar una tecla
                if(typeof pasarASiguienteLetra === "function"){
                    pasarASiguienteLetra();
                } // Por ejemplo, pasar a la siguiente letra
                cuentaTecla = obtenerTiempoPorDificultad(); // Reiniciar el contador de tecla según la dificultad
            }
        }, 1000);
    }

    
    function obtenerTiempoPorDificultad() {
        if (dificultadSeleccionada === "principiante") {
            return 10;
        } else if (dificultadSeleccionada === "avanzado") {
            return 5;
        } else {
            return 2;
        }
    }


    iniciarContadorTecla(); // Llama a la función para iniciar el contador de tecla

    window.reiniciarContadorTecla = iniciarContadorTecla;


});
