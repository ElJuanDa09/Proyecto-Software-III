async function cargarFinanzas() {
    const res = await fetch("http://127.0.0.1:8000/finanzas");
    const transacciones = await res.json();

    const lista = document.getElementById("transactions-list");
    lista.innerHTML = "";

    if (transacciones.length === 0) {
        lista.innerHTML = "<p class='text-muted'>No hay transacciones</p>";
        return;
    }

    transacciones.forEach(tr => {
        lista.innerHTML += `
            <div class="transaction-item">
                <span>${tr.categoria}</span>
                <span>${tr.tipo} - $${tr.monto}</span>
            </div>`;
    });
}

// Agregar transacción
async function agregarTransaccion(tipo, monto, categoria) {
    const nueva = { id: Date.now(), tipo, monto, categoria };

    const res = await fetch("http://127.0.0.1:8000/finanzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva)
    });

    if (res.ok) {
        toastr.success("Transacción agregada");
        cargarFinanzas();
    }
}

document.addEventListener("DOMContentLoaded", cargarFinanzas);
