document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const modoTutorial = params.get("tutorial") === "1";

    if(!modoTutorial) return;

    const enlaces = document.querySelectorAll("a");

    enlaces.forEach(link => {
        try {
            const url = new URL(link.href, window.location.origin);

            if(url.origin !== window.location.origin) return;

            url.searchParams.set("tutorial", "1");

            link.href = url.toString();

        } catch (err) {
            console.warn("link ignorado en tutorial:", link)
        }
    });
})