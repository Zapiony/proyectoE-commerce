const productos = [
    {id: 1, nombre: "Airpods última generación",  detalle:"Con opción de cancelación de ruido", puntuación: 4.5, opiniones: 200,precio: 50},
    {id: 2, nombre: "Iphone X",  detalle:"Con batería más resistente", puntuación: 3.5, opiniones: 800,precio: 1200},
    {id: 3, nombre: "MacBook Pro",  detalle:"Potente y elegante", puntuación: 2.5, opiniones: 1000,precio: 5000}
]

$(function() {
    var $productosContainer = $('#productos-container');

    $.each(productos, function(_, producto) {
        var $productoDiv = $('<div>').addClass('col');
        var $card = $('<div>').addClass('card');
        var $img = $('<img>').addClass('card-img-top').attr('src', 'https://via.placeholder.com/150').attr('alt', producto.nombre);
        var $cardBody = $('<div>').addClass('card-body');
        var $title = $('<h5>').addClass('card-title').text(producto.nombre);
        var $text = $('<p>').addClass('card-text').text(producto.detalle);
        var $btn = $('<a>')
            .addClass('btn btn-primary btn-add')
            .attr('href', '#')
            .data('id', producto.id)
            .data('nombre', producto.nombre)
            .text('Agregar');

        $cardBody.append($title, $text, $btn);
        $card.append($img, $cardBody);
        $productoDiv.append($card);

        $productosContainer.append($productoDiv);
    });
});