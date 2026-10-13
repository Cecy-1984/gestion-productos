export default class Producto {
    static items = [];

    constructor(codigo, nombre, precio, imagen) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = Number(precio);
        this.imagen = imagen;
    }

    static agregar(producto) {
        const existe = this.items.some(
            item => item.codigo === producto.codigo
        );

        if (existe) {
            return false;
        }

        this.items.push(producto);
        this.guardar();

        return true;
    }

    static eliminar(codigo) {
        this.items = this.items.filter(
            item => item.codigo !== codigo
        );

        this.guardar();
    }

    static guardar() {
        localStorage.setItem(
            "productos",
            JSON.stringify(this.items)
        );
    }

    static cargar() {
        try {
            const datos = localStorage.getItem("productos");

            if (!datos) {
                this.items = [];
                return;
            }

            const productosGuardados = JSON.parse(datos);

            if (!Array.isArray(productosGuardados)) {
                this.items = [];
                return;
            }

            this.items = productosGuardados.map(
                producto => new Producto(
                    producto.codigo,
                    producto.nombre,
                    producto.precio,
                    producto.imagen
                )
            );
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            this.items = [];
        }
    }
}