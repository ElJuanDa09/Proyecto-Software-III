from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Montar la carpeta de archivos estáticos
app.mount("/static", StaticFiles(directory="Frontend/static"), name="static")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ MODELOS ------------------
class Task(BaseModel):
    id: int
    titulo: str
    fecha: str
    completado: bool = False

class Transaccion(BaseModel):
    id: int
    tipo: str       # "ingreso" o "gasto"
    monto: float
    categoria: str

class Materia(BaseModel):
    id: int
    nombre: str
    profesor: str
    estado: str     # "en curso", "aprobada", etc.

class Proyecto(BaseModel):
    id: int
    titulo: str
    estado: str     # "en progreso", "completado"

# --------- Modelos para Index (Usuarios y Notificaciones) ---------
class Usuario(BaseModel):
    id: int
    nombre: str
    email: str
    password: str

class Notificacion(BaseModel):
    id: int
    mensaje: str
    fecha: str
    leida: bool = False

# ------------------ DATA TEMPORAL ------------------
tareas = []
finanzas = []
materias = []
proyectos = []
usuarios = []
notificaciones = [
    Notificacion(id=1, mensaje="Bienvenido a EduPlan 🎉", fecha="2025-09-11")
]

# ------------------ RUTAS ------------------

## Agenda
@app.get("/agenda", response_model=List[Task])
def get_agenda():
    return tareas

@app.post("/agenda", response_model=Task)
def add_task(task: Task):
    tareas.append(task)
    return task

## Finanzas
@app.get("/finanzas", response_model=List[Transaccion])
def get_finanzas():
    return finanzas

@app.post("/finanzas", response_model=Transaccion)
def add_transaccion(tr: Transaccion):
    finanzas.append(tr)
    return tr

## Académico
@app.get("/materias", response_model=List[Materia])
def get_materias():
    return materias

@app.post("/materias", response_model=Materia)
def add_materia(mat: Materia):
    materias.append(mat)
    return mat

## Herramientas (Proyectos extra)
@app.get("/proyectos", response_model=List[Proyecto])
def get_proyectos():
    return proyectos

@app.post("/proyectos", response_model=Proyecto)
def add_proyecto(proy: Proyecto):
    proyectos.append(proy)
    return proy

# ------------------ RUTAS INDEX ------------------

@app.post("/register", response_model=Usuario)
def registrar_usuario(user: Usuario):
    if any(u.email == user.email for u in usuarios):
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    usuarios.append(user)
    return user

@app.post("/login")
def login(email: str, password: str):
    user = next((u for u in usuarios if u.email == email and u.password == password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {"message": "Login exitoso", "user_id": user.id}

@app.get("/notificaciones", response_model=List[Notificacion])
def get_notificaciones():
    return notificaciones

@app.put("/usuarios/{id}", response_model=Usuario)
def actualizar_usuario(id: int, datos: Usuario):
    for i, u in enumerate(usuarios):
        if u.id == id:
            usuarios[i] = datos
            return datos
    raise HTTPException(status_code=404, detail="Usuario no encontrado")
