class productsView {
    constructor() {
        this.productosContainer = $("#productos-container");
        this.cartItemsContainer = $('#cart-items');
        this.cartTotalText = $('#cart-total');
        this.sidebarTotalText = $('#sidebar-cart-total');
        this.cartOverlay = $('#cart-overlay');
        this.sidebarCart = $('#sidebar-cart');
    }

    renderProducts(productos) {
        this.productosContainer.empty();
        $.each(productos, (_, producto) => {
            let $productoDiv = $('<div>').addClass('col mb-4');
            let $card = $('<div>').addClass('card');
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
            
            let $btnAdd = $('<a>')
                .addClass('btn btn-primary btn-add mt-auto')
                .data('id', producto.id)
                .text('Agregar al carrito');

            let $btnDetalle = $('<a>')
                .addClass('btn btn-outline-secondary btn-detalle mt-2')
                .text('Detalle producto')
                .on('click', () => {
                    localStorage.setItem('detalleProducto', JSON.stringify(producto));
                    window.location.href = '../detalle_producto/pagina.html';
                });

            $cardBody.append($title, $contentDiv, $btnAdd, $btnDetalle);
            $card.append($img, $cardBody);
            $productoDiv.append($card);

            this.productosContainer.append($productoDiv);
        });
    }

    actualizarCarritoUI(carrito, callbackEliminar) {
        // Calcular total
        let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        this.cartTotalText.text('$' + total.toFixed(2));
        this.sidebarTotalText.text('$' + total.toFixed(2));
        
        this.cartItemsContainer.empty();
        
        carrito.forEach(item => {
            let $cartCard = $('<div>').addClass('cart-item-card mb-2');
            let $cardContent = $('<div>').addClass('d-flex justify-content-between align-items-center p-2');
            
            let $itemInfo = $('<div>').addClass('item-info');
            $itemInfo.append(
                $('<h6>').addClass('mb-0').text(item.nombre),
                $('<small>').addClass('text-muted').text(`Cantidad: ${item.cantidad}`)
            );
            
            let $itemPrice = $('<div>').addClass('item-price text-end');
            let $btnEliminar = $('<button>')
                .addClass('btn btn-sm btn-danger mt-1')
                .text('Eliminar')
                .on('click', () => callbackEliminar(item.id));

            $itemPrice.append(
                $('<p>').addClass('mb-0 fw-bold').text('$' + (item.precio * item.cantidad).toFixed(2)),
                $btnEliminar
            );
            
            $cardContent.append($itemInfo, $itemPrice);
            $cartCard.append($cardContent);
            this.cartItemsContainer.append($cartCard);
        });
    }

    openCart() {
        this.cartOverlay.fadeIn();
        this.sidebarCart.addClass('active');
        $('body').css('overflow', 'hidden');
    }

    closeCart() {
        this.cartOverlay.fadeOut();
        this.sidebarCart.removeClass('active');
        $('body').css('overflow', '');
    }
}