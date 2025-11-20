document.addEventListener('DOMContentLoaded', function () {
    const productoSeleccionado = JSON.parse(localStorage.getItem('detalleProducto'));

    if (!productoSeleccionado || !productoSeleccionado.id) {
        document.querySelector('.pagina_producto').innerHTML = `
            <div class="alert alert-danger">No se encontró información del producto.</div>
        `;
        return;
    }

    const productos = [
        {
            id: 1,
            nombre: "Apple AirPods 4 (2024)",
            valoracion: "4.5 (200 valoraciones)",
            precio: "$50.00",
            descripcion: "Disfruta de un sonido inmersivo con los nuevos AirPods 4...",
            caracteristicas: [
                "Cancelación activa de ruido y modo ambiente.",
                "Audio espacial con seguimiento dinámico.",
                "Hasta 30 horas de batería con estuche MagSafe.",
                "Resistencia al sudor y al agua (IPX4).",
                "Incluye accesorios: case y fundas."
            ],
            imagen: "../img/AIRPODS.jpg",
            recomendaciones: [
                {
                    nombre: "Funda protectora MagSafe",
                    precio: "$19.99",
                    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSLxoxHwNn3NiJYsP2pvTjSaiOTJfWWm-GNI2Do399BKHMIQSdQM3bz1vXQ1sRr_s-2dDjA1ma7yr80YpE3ng1b_Kff4WNYRze0HoHWKA74zH4XO_nMcSz6xOXR2Wf_8CL0b9zyGM0&usqp=CAc"
                },
                {
                    nombre: "Cargador rápido USB-C Apple",
                    precio: "$29.00",
                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ00sCr-qNIkSUaPasVGuKUdozEPdgNIyxMvA&s"
                }
            ]
        },
        {
            id: 2,
            nombre: "iPhone X (2017)",
            valoracion: "3.5 (800 valoraciones)",
            precio: "$1200.00",
            descripcion: "El iPhone X marcó una nueva era en el diseño de los smartphones con su pantalla Super Retina OLED y su cuerpo de acero inoxidable. Destaca por su batería más resistente, Face ID avanzado y un rendimiento optimizado con el chip A11 Bionic.",
            caracteristicas: [
                "Pantalla Super Retina OLED de 5.8 pulgadas.",
                "Chip A11 Bionic con motor neuronal.",
                "Batería de larga duración con carga rápida e inalámbrica.",
                "Cámaras duales de 12 MP con modo retrato y HDR.",
                "Resistencia al agua y al polvo (IP67).",
                "Face ID para desbloqueo facial seguro."
            ],
            imagen: "../img/AIRPODS.jpg",

        },
        {
            id: 3,
            nombre: "MacBook Pro M3 Max",
            valoracion: "2.5 (120 valoraciones)",
            precio: "$5000.00",
            descripcion: "Un MacBook Pro potente y elegante, ideal para profesionales que buscan rendimiento y estilo.",
            caracteristicas: [
                "Pantalla Liquid Retina XDR de 16 pulgadas.",
                "Chip M3 Max con CPU de 12 núcleos y GPU de 38 núcleos.",
                "Hasta 36 horas de autonomía.",
                "Diseño de aluminio reciclado y teclado retroiluminado."
            ],
            imagen: "../img/AIRPODS.jpg",
        }
    ];

    const producto = productos.find(p => p.id === productoSeleccionado.id);

    if (!producto) {
        document.querySelector('.pagina_producto').innerHTML = `
            <div class="alert alert-warning">Producto no encontrado.</div>
        `;
        return;
    }

    document.getElementById('nombreProducto').textContent = producto.nombre;
    document.getElementById('valoracionProducto').textContent = producto.valoracion;
    document.getElementById('precioProducto').textContent = producto.precio;
    document.getElementById('descripcionProducto').textContent = producto.descripcion;
    document.getElementById('imagenPrincipal').src = producto.imagen;

    const ul = document.getElementById('caracteristicasProducto');
    producto.caracteristicas.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
    });

    const miniDiv = document.getElementById('miniaturas');
    producto.miniaturas.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.classList.add('imagenes_producto');
        img.style.width = '70px';
        img.addEventListener('click', () => {
            document.getElementById('imagenPrincipal').src = url;
        });
        miniDiv.appendChild(img);
    });

    const recDiv = document.getElementById('recomendaciones');
    producto.recomendaciones.forEach(r => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = '10rem';
        card.innerHTML = `
            <img src="${r.img}" class="card-img-top" alt="${r.nombre}">
            <div class="card-body text-center">
                <p class="card-text">${r.nombre}</p>
                <span class="text-primary fw-bold">${r.precio}</span>
            </div>
        `;
        recDiv.appendChild(card);
    });
});
