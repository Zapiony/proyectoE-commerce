class w {
    constructor() {
        this.model = new Products();
        this.view = new productsView();
        this.init();
    }

    init() {
    const products = this.model.getProducts();
    this.view.renderProducts(products);
    
    $('#cart-button').on('click', () => {
        this.view.openCart();
    });

    // 2. Evento para cerrar el carrito (clic en la 'X')
    $('.close-cart').on('click', () => {
        this.view.closeCart();
    });

    // 3. Evento para cerrar al hacer clic en el fondo oscuro
    $('#cart-overlay').on('click', () => {
        this.view.closeCart();
    });
}
}