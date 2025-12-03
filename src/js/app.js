// src/js/app.js

const API_BASE_URL = "http://localhost:8080/notas";

// Estado en memoria
let notas = [];
let notaSeleccionadaId = null;

// Referencias a elementos del DOM
let listaNotasEl;
let formNotaEl;
let tituloInputEl;
let contenidoTextAreaEl;
let metaDetalleEl;
let btnNuevaNotaEl;
let btnEliminarEl;
let btnCancelarEl;
let searchFormEl;
let searchInputEl;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cachear elementos del DOM
  listaNotasEl = document.querySelector(".nota-lista");
  formNotaEl = document.querySelector(".nota-form");
  tituloInputEl = document.getElementById("titulo");
  contenidoTextAreaEl = document.getElementById("contenido");
  metaDetalleEl = document.querySelector(".detalle-meta");

  // Botones
  btnNuevaNotaEl = document.querySelector(".columna-izquierda .btn-primary");
  btnEliminarEl = document.querySelector(".nota-form .btn-danger");
  btnCancelarEl = document.querySelector(".nota-form .btn-secondary");

  // Buscador
  searchFormEl = document.querySelector(".search-bar");
  searchInputEl = document.querySelector(".search-input");

  if (!listaNotasEl) {
    console.error("No se encontró .nota-lista en el HTML");
    return;
  }

  // 2. Listeners
  if (formNotaEl) {
    formNotaEl.addEventListener("submit", manejarSubmitGuardar);
  }

  if (btnEliminarEl) {
    btnEliminarEl.addEventListener("click", manejarClickEliminar);
  }

  if (btnCancelarEl) {
    btnCancelarEl.addEventListener("click", manejarClickCancelar);
  }

  if (btnNuevaNotaEl) {
    btnNuevaNotaEl.addEventListener("click", manejarClickNuevaNota);
  }

  if (searchFormEl) {
    searchFormEl.addEventListener("submit", manejarSubmitBuscar);
  }

  // 3. Cargar notas iniciales
  cargarNotas();
});

// =======================
//   CARGA Y RENDER NOTAS
// =======================

async function cargarNotas() {
  listaNotasEl.innerHTML = '<li class="estado">Cargando notas...</li>';

  try {
    const respuesta = await fetch(`${API_BASE_URL}/getNotas`);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    notas = await respuesta.json();

    // Reset selección si la nota actual ya no existe
    if (notaSeleccionadaId != null) {
      const sigueExistiendo = notas.some((n) => n.Id === notaSeleccionadaId);
      if (!sigueExistiendo) {
        notaSeleccionadaId = null;
        limpiarFormulario();
      }
    }

    renderizarNotas(notas);
  } catch (error) {
    console.error("Error al cargar notas:", error);
    listaNotasEl.innerHTML =
      '<li class="estado estado-error">No se pudieron cargar las notas.</li>';
  }
}

function renderizarNotas(lista) {
  listaNotasEl.innerHTML = "";

  if (!Array.isArray(lista) || lista.length === 0) {
    listaNotasEl.innerHTML = '<li class="estado">No hay notas disponibles</li>';
    return;
  }

  lista.forEach((nota) => {
    const item = document.createElement("li");
    item.className = "nota-item";
    item.dataset.id = nota.Id;

    if (nota.Id === notaSeleccionadaId) {
      item.classList.add("nota-item--seleccionada");
    }

    const titulo = document.createElement("h3");
    titulo.className = "nota-titulo";
    titulo.textContent = nota.titulo;

    const fecha = document.createElement("p");
    fecha.className = "nota-fecha";
    fecha.textContent = `Creada: ${formatearFecha(nota.fechaCreacion)}`;

    item.appendChild(titulo);
    item.appendChild(fecha);

    item.addEventListener("click", () => {
      seleccionarNota(nota.Id);
    });

    listaNotasEl.appendChild(item);
  });
}

// =======================
//   SELECCIONAR NOTA
// =======================

function seleccionarNota(id) {
  const nota = notas.find((n) => n.Id === id);
  if (!nota) return;

  notaSeleccionadaId = nota.Id;

  // Actualizar clases visuales
  document
    .querySelectorAll(".nota-item")
    .forEach((el) => el.classList.remove("nota-item--seleccionada"));

  const itemActual = listaNotasEl.querySelector(
    `.nota-item[data-id="${nota.Id}"]`
  );
  if (itemActual) {
    itemActual.classList.add("nota-item--seleccionada");
  }

  // Rellenar formulario
  tituloInputEl.value = nota.titulo || "";
  contenidoTextAreaEl.value = nota.contenido || "";

  // Meta info (id, fechas)
  if (metaDetalleEl) {
    const fechaCreacion = formatearFecha(nota.fechaCreacion);
    const fechaModificacion = formatearFecha(nota.fechaModificacion);

    metaDetalleEl.innerHTML = `
      <span>ID: ${nota.Id}</span>
      <span>Creada: ${fechaCreacion || "—"}</span>
      <span>Modificada: ${fechaModificacion || "—"}</span>
    `;
  }
}

// =======================
//   FORMULARIO: GUARDAR
// =======================

async function manejarSubmitGuardar(evento) {
  evento.preventDefault();

  const titulo = tituloInputEl.value.trim();
  const contenido = contenidoTextAreaEl.value.trim();

  if (!titulo || !contenido) {
    alert("Título y contenido son obligatorios.");
    return;
  }

  try {
    if (notaSeleccionadaId == null) {
      // Crear nueva nota
      const cuerpo = JSON.stringify({ titulo, contenido });

      const respuesta = await fetch(`${API_BASE_URL}/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: cuerpo,
      });

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        alert(
          `Error al crear la nota (${respuesta.status}): ${
            texto || "Solicitud inválida"
          }`
        );
        return;
      }

      alert("Nota creada correctamente");
      limpiarFormulario();
      await cargarNotas();
    } else {
      // Actualizar nota existente
      const cuerpo = JSON.stringify({
        id: notaSeleccionadaId, // el DTO en el backend espera "id"
        titulo,
        contenido,
      });

      const respuesta = await fetch(`${API_BASE_URL}/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: cuerpo,
      });

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        alert(
          `Error al actualizar la nota (${respuesta.status}): ${
            texto || "Solicitud inválida"
          }`
        );
        return;
      }

      alert("Nota actualizada correctamente");
      await cargarNotas();
      // Mantener seleccionada y refrescar datos en el formulario
      seleccionarNota(notaSeleccionadaId);
    }
  } catch (error) {
    console.error("Error al guardar nota:", error);
    alert("Ocurrió un error al guardar la nota.");
  }
}

// =======================
//   ELIMINAR Y CANCELAR
// =======================

async function manejarClickEliminar() {
  if (notaSeleccionadaId == null) {
    alert("Primero selecciona una nota para eliminarla.");
    return;
  }

  const confirmar = window.confirm("¿Seguro que deseas eliminar esta nota?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_BASE_URL}/${notaSeleccionadaId}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text();
      alert(
        `Error al eliminar la nota (${respuesta.status}): ${
          texto || "No se pudo eliminar"
        }`
      );
      return;
    }

    alert("Nota eliminada correctamente");
    notaSeleccionadaId = null;
    limpiarFormulario();
    await cargarNotas();
  } catch (error) {
    console.error("Error al eliminar nota:", error);
    alert("Ocurrió un error al eliminar la nota.");
  }
}

function manejarClickCancelar() {
  notaSeleccionadaId = null;
  limpiarFormulario();
  document
    .querySelectorAll(".nota-item")
    .forEach((el) => el.classList.remove("nota-item--seleccionada"));
}

function manejarClickNuevaNota() {
  notaSeleccionadaId = null;
  limpiarFormulario();
  document
    .querySelectorAll(".nota-item")
    .forEach((el) => el.classList.remove("nota-item--seleccionada"));
  tituloInputEl.focus();
}

function limpiarFormulario() {
  if (tituloInputEl) tituloInputEl.value = "";
  if (contenidoTextAreaEl) contenidoTextAreaEl.value = "";
  if (metaDetalleEl) {
    metaDetalleEl.innerHTML = "";
  }
}

// =======================
//   BUSCADOR
// =======================

async function manejarSubmitBuscar(evento) {
  evento.preventDefault();

  const termino = (searchInputEl?.value || "").trim();

  if (!termino) {
    await cargarNotas();
    return;
  }

  listaNotasEl.innerHTML = '<li class="estado">Buscando notas...</li>';

  try {
    const respuesta = await fetch(
      `${API_BASE_URL}/${encodeURIComponent(termino)}`
    );

    if (respuesta.status === 404) {
      listaNotasEl.innerHTML =
        '<li class="estado">No se encontraron notas con ese título.</li>';
      return;
    }

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    renderizarNotas(resultado);
  } catch (error) {
    console.error("Error al buscar notas:", error);
    listaNotasEl.innerHTML =
      '<li class="estado estado-error">Error al buscar notas.</li>';
  }
}

function formatearFecha(valorFecha) {
  if (!valorFecha) return "";
  const fecha = new Date(valorFecha);
  if (Number.isNaN(fecha.getTime())) {
    return "";
  }
  return fecha.toISOString().slice(0, 10);
}
