document.addEventListener("DOMContentLoaded", function() {

    const miniaturas = document.querySelectorAll(".imagenes_producto");
    const imagenPrincipal = document.querySelector(".galeria_producto img");
    const botonCarrito = document.querySelector(".btn-primary");
    const botonComprar = document.querySelector(".btn-success");
    const cards = document.querySelectorAll(".card");


    const inicioTiempo = new Date();

    // Función para cambiar la imagen principal
    miniaturas.forEach(mini => {
        mini.addEventListener("click", function() {
            imagenPrincipal.src = this.src;

            miniaturas.forEach(m => m.style.border = "none");
            this.style.border = "2px solid #007bff";
        });
    });

    // Funcion para calcular el tiempo de la página
    function tiempoEnPagina() {
        const ahora = new Date();
        const diferencia = (ahora - inicioTiempo) / 1000;
        return diferencia.toFixed(2);
    }

    // Funcion enfocada en agregar al carrito
    botonCarrito.addEventListener("click", function() {
        const tiempo = tiempoEnPagina();
        alert(` Producto agregado al carrito.Has tardado ${tiempo} segundos.`);
    });

    // Funcion compra rapida
    botonComprar.addEventListener("click", function() {
        const tiempo = tiempoEnPagina();
        const confirmar = confirm(`Han pasado ${tiempo} segundos desde visualización de la pantalla.¿Deseas proceder con la compra?`);
        if (confirmar) {
            alert("Compra realizada correctamente (simulación).");
        } else {
            alert("Compra anulada.");
        }
    });

    // funcion efectos visuales de las cards
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.05)";
            card.style.transition = "transform 0.3s";
            card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "none";
        });
    });

    // Mostrar el tiempo total de permanecia del usuario
    window.addEventListener("beforeunload", function() {
        const tiempo = tiempoEnPagina();
        console.log(`El usuario estuvo en el sitio ${tiempo} segundos.`);
    });
});
