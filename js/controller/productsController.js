class ProductsController {
    constructor() {
        this.model = new Products();
        this.view = new productsView();
        this.init();
    }

    init() {
        const products = this.model.getProducts();
        this.view.renderProducts(products);

        $(document).on('click', '.btn-add', (e) => {
            const id = $(e.currentTarget).data('id');
            const producto = this.model.getProductById(id);
            
            if (this.model.agregarAlCarrito(id)) {
                this.view.mostrarMensajeExito(producto.nombre);
                this.actualizarTodoElCarrito();
            }
        });

        $('#cart-button').on('click', () => this.view.openCart());
        $('.close-cart, #cart-overlay').on('click', () => this.view.closeCart());
    }

    actualizarTodoElCarrito() {
        const carrito = this.model.getCarrito();
        this.view.actualizarCarritoUI(carrito, (id) => this.eliminarDelCarrito(id));
        this.view.actualizarContador(carrito);
    }

    eliminarDelCarrito(id) {
        this.model.cart = this.model.cart.filter(item => item.id !== id);
        this.actualizarTodoElCarrito();
    }
}