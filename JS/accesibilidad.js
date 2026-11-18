document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("accessibility-toggle");
    const panel = document.getElementById("accessibility-panel");
    const close = document.getElementById("accessibility-close");
    const reset = document.getElementById("accessibility-reset");

    const html = document.documentElement;
    const body = document.body;

    const actions = [
        "high-contrast",
        "dark-contrast",
        "grayscale",
        "readable-font",
        "underline-links",
        "spacing"
    ];

    let textSize = 100;

    // Abrir y cerrar panel
    function openPanel() {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        close.focus();
    }

    function closePanel() {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
    }

    toggle.addEventListener("click", () => {
        if (panel.hidden) {
            openPanel();
        } else {
            closePanel();
        }
    });

    close.addEventListener("click", closePanel);

    // Cerrar con Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            closePanel();
        }
    });

    // Aplicar tamaño del texto
    function applyTextSize() {
        html.style.fontSize = textSize + "%";

        html.classList.remove(
            "a11y-large-text",
            "a11y-extra-large-text"
        );

        if (textSize === 112.5) {
            html.classList.add("a11y-large-text");
        }

        if (textSize === 125) {
            html.classList.add("a11y-extra-large-text");
        }
    }

    // Aplicar opciones
    function applyAction(action, enabled) {
        const className = "a11y-" + action;

        if (enabled) {
            body.classList.add(className);
        } else {
            body.classList.remove(className);
        }
    }

    // Guardar preferencias
    function saveSettings() {
        const settings = {
            textSize,
            active: actions.filter(action =>
                body.classList.contains("a11y-" + action)
            )
        };

        try {
            localStorage.setItem(
                "accessibilitySettings",
                JSON.stringify(settings)
            );
        } catch (error) {
            console.warn("No se pudieron guardar las preferencias.");
        }
    }

    // Actualizar botones
    function updateButtons() {
        document.querySelectorAll("[data-action]").forEach(button => {
            const action = button.dataset.action;

            if (actions.includes(action)) {
                const active = body.classList.contains("a11y-" + action);
                button.setAttribute("aria-pressed", String(active));
            }
        });
    }

    // Eventos de los botones
    panel.querySelectorAll("[data-action]").forEach(button => {

        button.addEventListener("click", () => {

            const action = button.dataset.action;

            if (action === "increase") {
                textSize = Math.min(125, textSize + 12.5);
            }

            else if (action === "decrease") {
                textSize = Math.max(75, textSize - 12.5);
            }

            else if (actions.includes(action)) {

                const enabled = !body.classList.contains("a11y-" + action);

                // Evitar combinar los dos modos de contraste
                if (action === "high-contrast" && enabled) {
                    applyAction("dark-contrast", false);
                }

                if (action === "dark-contrast" && enabled) {
                    applyAction("high-contrast", false);
                }

                applyAction(action, enabled);
            }

            applyTextSize();
            updateButtons();
            saveSettings();
        });
    });

    // Restablecer todo
    reset.addEventListener("click", () => {

        textSize = 100;

        actions.forEach(action => {
            applyAction(action, false);
        });

        applyTextSize();
        updateButtons();
        saveSettings();
    });

    // Recuperar preferencias guardadas
    try {
        const saved = JSON.parse(
            localStorage.getItem("accessibilitySettings")
        );

        if (saved) {
            textSize = [75, 87.5, 100, 112.5, 125].includes(saved.textSize)
                ? saved.textSize
                : 100;

            actions.forEach(action => {
                applyAction(
                    action,
                    Array.isArray(saved.active) && saved.active.includes(action)
                );
            });

            // Evitar dos modos de contraste simultáneos
            if (body.classList.contains("a11y-high-contrast")) {
                applyAction("dark-contrast", false);
            }

            applyTextSize();
        }
    } catch (error) {
        console.warn("No se pudieron recuperar las preferencias.");
    }

    updateButtons();

});