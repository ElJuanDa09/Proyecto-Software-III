const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "gestor_tareas";

async function main() {
  await client.connect();
  console.log("✅ Conectado a MongoDB");
  const db = client.db(dbName);

  // Crear usuario
  app.post("/usuarios", async (req, res) => {
    const usuario = req.body;
    const result = await db.collection("usuarios").insertOne(usuario);
    res.send(result);
  });

  // Listar usuarios
  app.get("/usuarios", async (req, res) => {
    const usuarios = await db.collection("usuarios").find().toArray();
    res.send(usuarios);
  });

  // Iniciar servidor
  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
  });
}

main().catch(console.error);

// Registro
async function registrar() {
    const nombre = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const pass = document.getElementById("registerPassword").value;

    const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now(), nombre, email, password: pass })
    });

    if (res.ok) {
        toastr.success("Registro exitoso. Ahora inicia sesión.");
    } else {
        const error = await res.json();
        toastr.error(error.detail || "Error en el registro");
    }
}

// Login
async function login() {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    const res = await fetch(`http://127.0.0.1:8000/login?email=${email}&password=${pass}`, {
        method: "POST"
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user_id", data.user_id);
        toastr.success("Bienvenido!");
        const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
        modal.hide();
    } else {
        toastr.error("Credenciales inválidas");
    }
}

// Notificaciones
async function cargarNotificaciones() {
    const res = await fetch("http://127.0.0.1:8000/notificaciones");
    const notis = await res.json();

    const lista = document.getElementById("notificationList");
    lista.innerHTML = "";

    notis.forEach(n => {
        lista.innerHTML += `
            <div class="list-group-item">
                <div class="d-flex justify-content-between">
                    <h6>${n.mensaje}</h6>
                    <small>${n.fecha}</small>
                </div>
            </div>`;
    });

    document.getElementById("notificationBadge").textContent = notis.length;
}

document.addEventListener("DOMContentLoaded", cargarNotificaciones);
