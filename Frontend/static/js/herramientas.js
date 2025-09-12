async function cargarProyectos() {
    const res = await fetch("http://127.0.0.1:8000/proyectos");
    const proyectos = await res.json();

    const lista = document.getElementById("projects-list");
    lista.innerHTML = "";

    if (proyectos.length === 0) {
        lista.innerHTML = "<p class='text-muted'>No hay proyectos</p>";
        return;
    }

    proyectos.forEach(p => {
        lista.innerHTML += `
            <div class="project-card">
                <strong>${p.titulo}</strong> - Estado: ${p.estado}
            </div>`;
    });
}

// Agregar proyecto
async function agregarProyecto(titulo, estado) {
    const nuevo = { id: Date.now(), titulo, estado };

    const res = await fetch("http://127.0.0.1:8000/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
    });

    if (res.ok) {
        toastr.success("Proyecto agregado");
        cargarProyectos();
    }
}

document.addEventListener("DOMContentLoaded", cargarProyectos);
