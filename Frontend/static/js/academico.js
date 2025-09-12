async function cargarMaterias() {
    const res = await fetch("http://127.0.0.1:8000/materias");
    const materias = await res.json();

    const lista = document.getElementById("subjects-list");
    lista.innerHTML = "";

    if (materias.length === 0) {
        lista.innerHTML = "<p class='text-muted'>No hay materias</p>";
        return;
    }

    materias.forEach(m => {
        lista.innerHTML += `
            <div class="subject-item">
                <strong>${m.nombre}</strong> - ${m.profesor} [${m.estado}]
            </div>`;
    });
}

// Agregar materia
async function agregarMateria(nombre, profesor, estado) {
    const nueva = { id: Date.now(), nombre, profesor, estado };

    const res = await fetch("http://127.0.0.1:8000/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva)
    });

    if (res.ok) {
        toastr.success("Materia agregada");
        cargarMaterias();
    }
}

document.addEventListener("DOMContentLoaded", cargarMaterias);
