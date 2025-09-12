async function cargarAgenda() {
    const res = await fetch("http://127.0.0.1:8000/agenda");
    const tareas = await res.json();

    const lista = document.getElementById("tasks-list");
    lista.innerHTML = "";

    if (tareas.length === 0) {
        lista.innerHTML = "<p class='text-muted'>No hay tareas</p>";
        return;
    }

    tareas.forEach(t => {
        lista.innerHTML += `
            <div class="task-item ${t.completado ? 'completed' : ''}">
                <strong>${t.titulo}</strong><br>
                <small>${t.fecha}</small>
            </div>`;
    });
}

// Ejemplo de agregar tarea
async function agregarTarea(titulo, fecha) {
    const nueva = { id: Date.now(), titulo, fecha, completado: false };

    const res = await fetch("http://127.0.0.1:8000/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva)
    });

    if (res.ok) {
        toastr.success("Tarea agregada");
        cargarAgenda();
    }
}

document.addEventListener("DOMContentLoaded", cargarAgenda);
