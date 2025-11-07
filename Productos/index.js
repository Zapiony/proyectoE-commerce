const productos = [
    {id: 1, nombre: "Airpods última generación",  detalle:"Con opción de cancelación de ruido", puntuación: 4.5, opiniones: 200,precio: 50},
    {id: 2, nombre: "Iphone X",  detalle:"Con batería más resistente", puntuación: 3.5, opiniones: 800,precio: 1200},
    {id: 3, nombre: "MacBook Pro",  detalle:"Potente y elegante", puntuación: 2.5, opiniones: 1000,precio: 5000}
]

let carrito = [];

function actualizarTotales() {
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    $('#cart-total').text('$' + total.toFixed(2));
    $('#sidebar-cart-total').text('$' + total.toFixed(2));
    
    let $cartItems = $('#cart-items');
    $cartItems.empty();
    
    carrito.forEach(item => {
        let $cartCard = $('<div>').addClass('cart-item-card mb-2');
        let $cardContent = $('<div>').addClass('d-flex justify-content-between align-items-center p-2');
        
        let $itemInfo = $('<div>').addClass('item-info');
        $itemInfo.append(
            $('<h6>').addClass('mb-0').text(item.nombre),
            $('<small>').addClass('text-muted').text(`Cantidad: ${item.cantidad}`)
        );
        
        let $itemPrice = $('<div>').addClass('item-price text-end');
        $itemPrice.append(
            $('<p>').addClass('mb-0 fw-bold').text('$' + (item.precio * item.cantidad).toFixed(2)),
            $('<button>').addClass('btn btn-sm btn-danger mt-1')
                .text('Eliminar')
                .data('id', item.id)
                .on('click', function() {
                    removeFromCart(item.id);
                })
        );
        
        $cardContent.append($itemInfo, $itemPrice);
        $cartCard.append($cardContent);
        $cartItems.append($cartCard);
    });
}

function removeFromCart(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarTotales();
}

$(function() {
    let $productosContainer = $('#productos-container');

    $.each(productos, function(_, producto) {
        let $productoDiv = $('<div>').addClass('col mb-4');
        let $card = $('<div>').addClass('card h-100');
        let $img = $('<img>')
            .addClass('card-img-top')
            .attr('src', '/img/fondo.jpg')
            .attr('alt', producto.nombre);
        let $cardBody = $('<div>').addClass('card-body d-flex flex-column');
        let $title = $('<h5>').addClass('card-title').text(producto.nombre);
        let $text = $('<p>').addClass('card-text').text(producto.detalle);
        let $contentDiv = $('<div>').addClass('flex-grow-1');
        let $rating = $('<p>').addClass('mb-1 text-muted').text('⭐ ' + producto.puntuación + ' (' + producto.opiniones + ' opiniones)');
        let $price = $('<p>').addClass('h5 mt-2').text('$' + Number(producto.precio).toFixed(2));
        $contentDiv.append($text, $rating, $price);
        let $btn = $('<a>')
            .addClass('btn btn-primary btn-add mt-auto')
            .data('id', producto.id)
            .data('nombre', producto.nombre)
            .text('Agregar al carrito');
        $cardBody.append($title, $contentDiv, $btn);
        $card.append($img, $cardBody);
        $productoDiv.append($card);

        $productosContainer.append($productoDiv);
    });

    $productosContainer.on('click', '.btn-add', function(e) {
        e.preventDefault();
        let id = $(this).data('id');
        let producto = productos.find(p => p.id === id);
        let itemCarrito = carrito.find(item => item.id === id);
        if (itemCarrito) {
            itemCarrito.cantidad += 1;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        actualizarTotales();
    });

    // Función para abrir el carrito
    function openCart() {
        $('#cart-overlay').fadeIn();
        $('#sidebar-cart').addClass('active');
        $('body').css('overflow', 'hidden');
    }

    // Función para cerrar el carrito
    function closeCart() {
        $('#cart-overlay').fadeOut();
        $('#sidebar-cart').removeClass('active');
        $('body').css('overflow', '');
    }

    // Click en el botón del carrito
    $('#cart-button').on('click', function() {
        openCart();
    });

    // Click en el overlay o botón de cerrar
    $('#cart-overlay, .close-cart').on('click', function() {
        closeCart();
    });

    // Prevenir que el click dentro del carrito cierre el sidebar
    $('#sidebar-cart').on('click', function(e) {
        e.stopPropagation();
    });
});