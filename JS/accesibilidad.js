document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("accessibility-toggle");
    const panel = document.getElementById("accessibility-panel");
    const close = document.getElementById("accessibility-close");
    const reset = document.getElementById("accessibility-reset");

    if (!toggle || !panel) {
        return;
    }

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
    const textSteps = [75, 87.5, 100, 112.5, 125];
    let textSize = 100;

    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "Opciones de accesibilidad");

    function openPanel() {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Cerrar opciones de accesibilidad");
        if (close) {
            close.focus();
        }
    }

    function closePanel(returnFocus = true) {
        if (panel.hidden) {
            return;
        }
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir opciones de accesibilidad");
        if (returnFocus) {
            toggle.focus();
        }
    }

    toggle.addEventListener("click", () => {
        if (panel.hidden) {
            openPanel();
        } else {
            closePanel();
        }
    });

    if (close) {
        close.addEventListener("click", () => closePanel());
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !panel.hidden) {
            closePanel();
        }

        if (event.key === "Tab" && !panel.hidden) {
            const focusable = [...panel.querySelectorAll(
                'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            )].filter(element => !element.hidden);

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    function applyTextSize() {
        html.style.zoom = textSize + "%";

        const textStatus = panel.querySelector("[data-text-size]");
        if (textStatus) {
            textStatus.textContent = textSize + "%";
        }
    }

    function applyAction(action, enabled) {
        const className = "a11y-" + action;
        body.classList.toggle(className, enabled);

        if (action === "grayscale" || action === "readable-font") {
            html.classList.toggle(className, enabled);
        }
    }

    function saveSettings() {
        const settings = {
            textSize,
            active: actions.filter(action =>
                body.classList.contains("a11y-" + action)
            )
        };

        try {
            sessionStorage.setItem("accessibilitySettings", JSON.stringify(settings));
        } catch (error) {
            console.warn("No se pudieron guardar las preferencias.", error);
        }
    }

    function updateButtons() {
        panel.querySelectorAll("[data-action]").forEach(button => {
            const action = button.dataset.action;

            if (actions.includes(action)) {
                const active = body.classList.contains("a11y-" + action);
                button.setAttribute("aria-pressed", String(active));
            } else if (action === "increase") {
                const disabled = textSize >= 125;
                button.disabled = disabled;
                button.setAttribute("aria-label", "Aumentar tamaño del texto");
            } else if (action === "decrease") {
                const disabled = textSize <= 75;
                button.disabled = disabled;
                button.setAttribute("aria-label", "Reducir tamaño del texto");
            }
        });
    }

    const textGroup = panel.querySelector('[data-action="increase"]')?.closest(".accessibility-group");
    if (textGroup && !textGroup.querySelector("[data-text-size]")) {
        const status = document.createElement("span");
        status.dataset.textSize = "";
        status.setAttribute("aria-live", "polite");
        status.className = "accessibility-text-size";
        textGroup.appendChild(status);
    }

    panel.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.action;

            if (action === "increase") {
                const currentIndex = textSteps.indexOf(textSize);
                textSize = textSteps[Math.min(textSteps.length - 1, currentIndex + 1)];
            } else if (action === "decrease") {
                const currentIndex = textSteps.indexOf(textSize);
                textSize = textSteps[Math.max(0, currentIndex - 1)];
            } else if (actions.includes(action)) {
                const enabled = !body.classList.contains("a11y-" + action);

                if (action === "high-contrast" && enabled) {
                    applyAction("dark-contrast", false);
                } else if (action === "dark-contrast" && enabled) {
                    applyAction("high-contrast", false);
                }

                applyAction(action, enabled);
            }

            applyTextSize();
            updateButtons();
            saveSettings();
        });
    });

    if (reset) {
        reset.addEventListener("click", () => {
            textSize = 100;
            actions.forEach(action => applyAction(action, false));
            applyTextSize();
            updateButtons();
            saveSettings();
        });
    }

    try {
        const saved = JSON.parse(sessionStorage.getItem("accessibilitySettings"));

        if (saved) {
            textSize = textSteps.includes(saved.textSize) ? saved.textSize : 100;

            actions.forEach(action => {
                applyAction(
                    action,
                    Array.isArray(saved.active) &&
                    saved.active.includes(action)
                );
            });
        }
    } catch (error) {
        console.warn("No se pudieron recuperar las preferencias.", error);
    }

    applyTextSize();
    updateButtons();
});
