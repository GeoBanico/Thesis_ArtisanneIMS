class CartProduct {
    constructor(id, productId, products, cartId, carts) {
        this.id = id;

        this.productId = productId;
        this.cartId = cartId;

        this.products = products;
        this.carts = carts;
    }
}

module.exports = {
    CartProduct: CartProduct
};
