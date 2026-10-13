import Producto from "./classes/Producto.js";

const formulario = document.querySelector("#producto-form");
const tablaProductos = document.querySelector("#tabla-productos");

const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
});

function agregarCelda(fila, contenido) {
    const celda = document.createElement("td");

    celda.className = "border border-gray-300 p-2";
    celda.textContent = contenido;

    fila.appendChild(celda);
}

function renderizarProductos() {
    tablaProductos.replaceChildren();

    if (Producto.items.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.className = "border border-gray-300 p-4 text-center";
        celda.textContent = "Todavía no hay productos cargados.";

        fila.appendChild(celda);
        tablaProductos.appendChild(fila);

        return;
    }

    Producto.items.forEach((producto) => {
        const fila = document.createElement("tr");

        fila.className = "hover:bg-gray-50";

        agregarCelda(fila, producto.codigo);
        agregarCelda(fila, producto.nombre);
        agregarCelda(fila, formatoPrecio.format(producto.precio));

        const celdaImagen = document.createElement("td");
        celdaImagen.className = "border border-gray-300 p-2";

        const imagen = document.createElement("img");

        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = "h-14 w-14 object-cover";

        imagen.addEventListener("error", () => {
            celdaImagen.textContent = "Imagen no disponible";
        }, { once: true });

        celdaImagen.appendChild(imagen);
        fila.appendChild(celdaImagen);

        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "border border-gray-300 p-2";

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className =
            "boton-eliminar bg-red-600 px-3 py-1 text-white hover:bg-red-700";
        botonEliminar.dataset.codigo = producto.codigo;

        celdaAcciones.appendChild(botonEliminar);
        fila.appendChild(celdaAcciones);

        tablaProductos.appendChild(fila);
    });
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const codigo = formulario.elements.codigo.value.trim();
    const nombre = formulario.elements.nombre.value.trim();
    const precio = Number(formulario.elements.precio.value);
    const imagen = formulario.elements.imagen.value.trim();

    if (
        !codigo ||
        !nombre ||
        !imagen ||
        !Number.isFinite(precio) ||
        precio < 0
    ) {
        alert("Completá todos los campos con datos válidos.");
        return;
    }

    const nuevoProducto = new Producto(
        codigo,
        nombre,
        precio,
        imagen
    );

    const agregado = Producto.agregar(nuevoProducto);

    if (!agregado) {
        alert("Ya existe un producto con ese código.");
        return;
    }

    renderizarProductos();
    formulario.reset();
    formulario.elements.codigo.focus();
});

tablaProductos.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) {
        return;
    }

    const boton = evento.target.closest(".boton-eliminar");

    if (!boton) {
        return;
    }

    Producto.eliminar(boton.dataset.codigo);
    renderizarProductos();
});

Producto.cargar();
renderizarProductos();