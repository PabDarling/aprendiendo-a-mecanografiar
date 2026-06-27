document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorBox.textContent = "";

        const nombre = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        if(!nombre || !password) {
            errorBox.textContent = "COMPLETE TODOS LOS CAMPOS";
            return;
        }

        try {
            const user = await window.api.login({ nombre, password });

            
            if(!user) {
                errorBox.textContent = "Usuario o contraseña incorrectos.";
                return; 
            }

            localStorage.setItem("user", JSON.stringify(user));

            location.href = "index.html";
        } catch (err) {
            console.error("Error de login", err);
            errorBox.textContent = "Hubo un error al iniciar sesion.";
        }
    });
})