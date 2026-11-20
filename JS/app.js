const idiomasDisponibles = ["es", "en"];
const selectorIdioma = document.getElementById("idioma") || crearSelectorIdioma();
const rutaLocales = new URL("../locales/", document.currentScript.src);

function crearSelectorIdioma() {
    const menu = document.querySelector(".menu-bar");
    if (!menu) {
        return null;
    }

    const selector = document.createElement("select");
    selector.id = "idioma";
    selector.className = "idioma-selector";
    selector.setAttribute("aria-label", "Seleccionar idioma");
    selector.innerHTML = '<option value="es">Español</option><option value="en">English</option>';
    menu.appendChild(selector);

    const estilos = document.createElement("style");
    estilos.textContent = `
        @media (min-width: 769px) {
            .menu-bar > .menus {
                margin-right: 48px;
            }
        }

        .idioma-selector {
            position: absolute;
            top: 55%;
            right: 15px;
            transform: translateY(-50%);
            min-width: 108px;
            padding: 9px 12px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            background: #fff;
            color: #333;
            cursor: pointer;
        }

        @media (max-width: 1272px) {
            .idioma-selector {
                right: 78px;
            }
        }
    `;
    document.head.appendChild(estilos);

    return selector;
}

function obtenerIdiomaInicial() {
    const guardado = localStorage.getItem("idioma");
    if (idiomasDisponibles.includes(guardado)) {
        return guardado;
    }

    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

async function cambiarIdioma(idioma) {
    if (!idiomasDisponibles.includes(idioma)) {
        console.error(`Idioma no admitido: ${idioma}`);
        return;
    }

    try {
        const respuesta = await fetch(new URL(`${idioma}.json`, rutaLocales));
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar el idioma ${idioma}: ${respuesta.status}`);
        }

        const traducciones = await respuesta.json();
        document.querySelectorAll("[data-i18n]").forEach(elemento => {
            const clave = elemento.dataset.i18n;
            if (Object.prototype.hasOwnProperty.call(traducciones, clave)) {
                elemento.textContent = traducciones[clave];
            }
        });

        document.documentElement.lang = idioma;
        if (selectorIdioma) {
            selectorIdioma.value = idioma;
        }

        try {
            localStorage.setItem("idioma", idioma);
        } catch (error) {
            console.error("No se pudo guardar el idioma seleccionado:", error);
        }
    } catch (error) {
        console.error("Error al cambiar el idioma:", error);
        if (selectorIdioma) {
            selectorIdioma.value = document.documentElement.lang;
        }
    }
}

if (selectorIdioma) {
    selectorIdioma.addEventListener("change", () => {
        cambiarIdioma(selectorIdioma.value);
    });
}

cambiarIdioma(obtenerIdiomaInicial());
