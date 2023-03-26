class CartProduct {
    constructor(id, boughtquantity, productId, products, cartId, carts) {
        this.id = id;
        this.boughtquantity = boughtquantity;

        this.productId = productId;
        this.cartId = cartId;

        this.products = products;
        this.carts = carts;
    }
}

module.exports = {
    CartProduct: CartProduct
};
