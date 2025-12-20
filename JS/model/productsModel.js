const productos = [
    {id: 1, nombre: "Airpods última generación",  detalle:"Con opción de cancelación de ruido", puntuación: 4.5, opiniones: 200,precio: 50},
    {id: 2, nombre: "Iphone X",  detalle:"Con batería más resistente", puntuación: 3.5, opiniones: 800,precio: 1200},
    {id: 3, nombre: "MacBook Pro",  detalle:"Potente y elegante", puntuación: 2.5, opiniones: 1000,precio: 5000}
]

class Products {

    constructor() {
        this.Products = productos;
        this.cart = [];
    }

    getProducts() {
        return this.Products;
    }

    getProductById(id) {
        return this.Products.find(p => 
            p.id == id
        )
    }

    getProductoDest() {
        return this.Products.find(p => 
            p.destacado == true
        )
    }

    getCarrito() {
        return this.cart;
    }
}