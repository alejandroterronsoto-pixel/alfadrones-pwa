// js/cotizador.js

document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const selectServicio = document.getElementById("tipo-servicio");
  const selectDuracion = document.getElementById("duracion");
  const checkEdicion = document.getElementById("extra-edicion");
  const checkFotos = document.getElementById("extra-fotos");
  const checkDesplazamiento = document.getElementById("extra-desplazamiento");
  const divResultado = document.getElementById("resultado-cotizacion");
  const spanPrecioFinal = document.getElementById("precio-final");
  const btnWhatsapp = document.getElementById("btn-generar-whatsapp");
  const pError = document.getElementById("mensaje-error");

  // Tabla de precios base (MXN)
  const preciosBase = {
    eventos: { corta: 4500, media: 6500, larga: 9000 },
    bienes: { corta: 3950, media: 5500, larga: 8000 },
    obra: { corta: 5000, media: 7500, larga: 12000 }, // Incluye topografía básica
    general: { corta: 4000, media: 6000, larga: 8500 },
  };

  // Costos adicionales
  const costosExtra = {
    edicion: 1500,
    fotos: 800,
    desplazamiento: 1200,
  };

  // Función para calcular precio
  function calcularPrecio() {
    const servicio = selectServicio.value;
    const duracion = selectDuracion.value;

    if (!servicio || !duracion) {
      ocultarResultado();
      return;
    }

    let total = preciosBase[servicio][duracion];

    if (checkEdicion.checked) total += costosExtra.edicion;
    if (checkFotos.checked) total += costosExtra.fotos;
    if (checkDesplazamiento.checked) total += costosExtra.desplazamiento;

    mostrarResultado(total);
  }

  function mostrarResultado(precio) {
    // Formatear número con comas (ej: $12,500)
    const formatoMoneda = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(precio);

    spanPrecioFinal.textContent = formatoMoneda;
    divResultado.style.display = "block";
    btnWhatsapp.disabled = false;
    pError.style.display = "none";
  }

  function ocultarResultado() {
    divResultado.style.display = "none";
    btnWhatsapp.disabled = true;
  }

  // Generar mensaje de WhatsApp
  btnWhatsapp.addEventListener("click", function () {
    const servicioText =
      selectServicio.options[selectServicio.selectedIndex].text;
    const duracionText =
      selectDuracion.options[selectDuracion.selectedIndex].text;
    const precioTexto = spanPrecioFinal.textContent;

    let extras = [];
    if (checkEdicion.checked) extras.push("Edición Pro");
    if (checkFotos.checked) extras.push("Fotos Aéreas");
    if (checkDesplazamiento.checked) extras.push("Fuera de CDMX");

    const extrasTexto = extras.length > 0 ? extras.join(", ") : "Ninguno";

    // Construir el mensaje
    const mensaje = `Hola Alfadrones! 👋\n\nSoy [Tu Nombre] y quiero cotizar:\n\n📍 Servicio: ${servicioText}\n⏱️ Duración: ${duracionText}\n➕ Extras: ${extrasTexto}\n💰 Presupuesto Estimado Web: ${precioTexto}\n\n¿Están disponibles para este proyecto?`;

    // Codificar URL para WhatsApp
    const urlWhatsApp = `https://wa.me/525554359458?text=${encodeURIComponent(
      mensaje
    )}`;

    // Abrir en nueva pestaña
    window.open(urlWhatsApp, "_blank");
  });

  // Event Listeners para recalcular cuando cambie algo
  [
    selectServicio,
    selectDuracion,
    checkEdicion,
    checkFotos,
    checkDesplazamiento,
  ].forEach((el) => {
    el.addEventListener("change", calcularPrecio);
  });
});
