document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("registerError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorBox.textContent = "";

        const nombre = document.getElementById("registerUsername").value.trim();
        const password = document.getElementById("registerPassword").value;

        if(!nombre || !password) {
            errorBox.textContent = "COMPLETE TODOS LOS CAMPOS";
            return;
        }

        try {
                const user = await window.api.register({ nombre, password });
                console.log("Resultado del registro:", user)
                
                
                if(!user || user.error) {

                    if(user?.error?.includes("UNIQUE")) {
                        errorBox.classList.add("error-message");
                        errorBox.textContent = "❌ El nombre de usuario ya esta registrado";
                    } else {
                        errorBox.textContent = user?.error ||  "NO SE PUDO REGISTRAR EL USUARIO";
                    }

                    return; 
                }



                const successBox = document.getElementById("registerSuccess");
                let timeleft = 3;
                successBox.textContent = `Usuario registrado con exito. Redirigiendo en ${timeleft}...`


                const countdown = setInterval(() => {
                    timeleft--;
                    successBox.textContent = `Usuario registrado con exito. Redirigiendo en ${timeleft}...`

                    if(timeleft<=0) {
                        clearInterval(countdown);
                        window.location.replace("login.html");
                    }
                }, 1000);


                



            } catch (err) {
                console.error("Error de registro:", err);
                errorBox.textContent = "Hubo un error al registrar.";
        }
    });
})