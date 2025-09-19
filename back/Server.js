const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Estudiantes", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error(err));

// Ejemplo: modelo Usuario
const Usuario = mongoose.model("Usuario", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));

// Ruta para obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Ruta para agregar un usuario
app.post("/usuarios", async (req, res) => {
  const nuevo = new Usuario(req.body);
  await nuevo.save();
  res.json(nuevo);
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
