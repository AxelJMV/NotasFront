# 📝 NotasFront

Interfaz web sencilla para crear, editar, buscar y eliminar notas, pensada como proyecto de práctica para reforzar **HTML5, CSS3 y JavaScript** consumiendo una API REST (por ejemplo, un backend en **Spring Boot**) a través de `http://localhost:8080/notas`.

> 💡 Ideal como proyecto para practicar CRUD, manejo del DOM y consumo de APIs desde el frontend.

---

## 📸 Vista previa

![Vista previa de la aplicación de notas](assets/screenshot-notas.png)


---

## ✨ Características principales

- 📄 **Listado de notas** en una columna lateral.
- 👁️ **Vista de detalle** de la nota seleccionada.
- ➕ **Crear nuevas notas** con título y contenido.
- ✏️ **Editar notas existentes**.
- 🗑️ **Eliminar notas** desde la interfaz.
- 🔎 **Buscador** para filtrar notas por texto.
- ℹ️ Visualización de metadatos básicos de la nota (por ejemplo: ID, fechas, etc. si el backend los expone).

---

## 🏗️ Arquitectura general

Este proyecto está pensado como el **frontend** de una pequeña aplicación de notas:

- **Frontend**: HTML, CSS y JavaScript vanilla.
- **Backend (esperado)**: servicio REST que expone endpoints bajo `http://localhost:8080/notas`.
- Comunicación a través de **fetch** / llamadas HTTP para realizar operaciones CRUD.

---

## 🧩 Tecnologías utilizadas

- ⚙️ **JavaScript (ES6+)**
- 🧱 **HTML5**
- 🎨 **CSS3**
- 🌐 Consumo de API REST (`fetch` / `XMLHttpRequest`)
- 🐙 **Git & GitHub** para control de versiones

---

## 🔌 Dependencia del backend

La app asume la existencia de un backend accesible en:

```text
http://localhost:8080/notas

## END POINTS
	•	GET /notas → Listar todas las notas
	•	GET /notas/{id} → Obtener una nota por ID
	•	POST /notas → Crear nueva nota
	•	PUT /notas/{id} → Actualizar una nota existente
	•	DELETE /notas/{id} → Eliminar una nota



🚀 Cómo ejecutar el proyecto
1.-Clonar repositorio:
git clone https://github.com/AxelJMV/NotasFront.git

2.-Entrar a la carpeta del proyecto
cd NotasFront


3.-Opciones para abrir el proyecto
Abrir el archivo index.html en el navegador(requiere modificar BackEnd para punto de entrada )
Usar extebsuib como Live Server en VS Code para levantar el servidor estático. 

4.-Asegurarse de tener el back end corriendo Spring Boot
http://localhost:8080/notas


Este proyecto se utiliza con fines educativos y personales.
Siéntete libre de utilizarlo como base para tus propios experimentos y aprendizaje.

