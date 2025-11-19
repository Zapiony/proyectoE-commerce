class productsView {
    constructor() {
        this.containerProducts = $("#productos-container");
        this.carrito = $("#carrito");
    }

    renderProducts(productos) {
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
    }
}