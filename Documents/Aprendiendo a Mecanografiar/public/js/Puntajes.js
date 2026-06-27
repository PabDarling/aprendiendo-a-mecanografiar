document.addEventListener("DOMContentLoaded", () => {
    const scoreList = document.getElementById("scoreList");
    const btnUserTop = document.getElementById("btnUserTop");
    const btnGlobalTop = document.getElementById("btnGlobalTop");

    const currentUser = JSON.parse(localStorage.getItem("user"));

    loadGlobalTop();

    btnUserTop.addEventListener("click", () => {
        loadUserTop(currentUser.id);
    });

    btnGlobalTop.addEventListener("click", loadGlobalTop);

    async function loadGlobalTop() {
        try {
            const scores = await window.api.getScores();
            renderScores(scores);
        } catch (err) {
            console.error("[TOP GLOBAL]", err);
            scoreList.innerHTML = "<li>ERROR CARGANDO LOS PUNTOS GLOBALES</li>"
        }
    }

    async function loadUserTop() {
        try {
            const scores = await window.api.getUserScore(currentUser.id);
            renderScores(scores);
        } catch (err) {
            console.error("[Top USUARIO]", err);
            scoreList.innerHTML = "<li>ERROR CARGANDO TUS PUNTAJES</li>"
        }
    }

    async function renderScores(scores) {
        if (!scores || scores.length === 0) {
            scoreList.innerHTML = "<li>NO HAY PUNTAJES REGISTRADOS</li>"
            return;
        }

        scoreList.innerHTML = "";
        scores.forEach((s, i) => {
            const li = document.createElement("li");
            li.textContent = `${i + 1}. ${s.nombre} - ${s.puntos} puntos (${s.duracion}, ${s.dificultad}, ${new Date(s.fecha).toLocaleDateString()})`;
            scoreList.appendChild(li);      
        });
    }
})