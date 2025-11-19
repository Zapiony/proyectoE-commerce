class ProductsController {
    constructor() {
        this.model = new Products();
        this.view = new productsView();
        this.init();
    }

    init() {
        const products = this.model.getProducts();
        const cart = this.model.getCarrito();

        this.view.renderProducts(products);
    }
}