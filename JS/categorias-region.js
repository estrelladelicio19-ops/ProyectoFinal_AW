const regiones = {
    "es-PE": { zona: "America/Lima", moneda: "PEN" },
    "es-ES": { zona: "Europe/Madrid", moneda: "EUR" },
    "en-US": { zona: "America/New_York", moneda: "USD" }
};

const selectorRegion = document.getElementById("region");
const tarjetas = document.querySelectorAll(".card-producto");

tarjetas.forEach((tarjeta) => {
    const precio = tarjeta.querySelector(".precio-actual");
    if (precio) {
        const textoSoles = precio.textContent
            .replace(/[^0-9.,]/g, "")
            .replace(/,/g, "");
        precio.dataset.precioSoles = textoSoles;
    }

    const fechaHora = document.createElement("div");
    fechaHora.className = "fecha-hora-producto";
    fechaHora.innerHTML = `
        <span>Fecha<strong class="fecha-regional">--</strong></span>
        <span>Hora<strong class="hora-regional">--</strong></span>
    `;
    tarjeta.insertBefore(fechaHora, tarjeta.querySelector(".precio-contenedor"));
});

function actualizarFechaHora() {
    const region = regiones[selectorRegion.value];
    const idioma = selectorRegion.value;
    const ahora = new Date();

    const formatoFecha = new Intl.DateTimeFormat(idioma, {
        timeZone: region.zona,
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const formatoHora = new Intl.DateTimeFormat(idioma, {
        timeZone: region.zona,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    document.querySelectorAll(".fecha-regional").forEach((elemento) => {
        elemento.textContent = formatoFecha.format(ahora);
    });

    document.querySelectorAll(".hora-regional").forEach((elemento) => {
        elemento.textContent = formatoHora.format(ahora);
    });

    localStorage.setItem("region-categorias", selectorRegion.value);
}

function actualizarPrecios() {
    const region = regiones[selectorRegion.value];
    const idioma = selectorRegion.value;

    document.querySelectorAll(".precio-actual").forEach((precio) => {
        const monto = Number(precio.dataset.precioSoles);
        if (!Number.isFinite(monto)) {
            return;
        }

        precio.textContent = new Intl.NumberFormat(idioma, {
            style: "currency",
            currency: region.moneda,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(monto);
    });
}

const regionGuardada = localStorage.getItem("region-categorias");
if (regionGuardada && regiones[regionGuardada]) {
    selectorRegion.value = regionGuardada;
}

selectorRegion.addEventListener("change", () => {
    actualizarFechaHora();
    actualizarPrecios();
});
actualizarFechaHora();
actualizarPrecios();
setInterval(actualizarFechaHora, 1000);
