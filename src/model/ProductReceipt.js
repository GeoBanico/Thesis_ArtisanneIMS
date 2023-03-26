class ProductReceipt {
    constructor(id, receiptId, productId, cost, boughtQuantity, isDeleted, receipts, products) {
        this.id = id;
        this.receiptId = receiptId;
        this.productId = productId;
        this.cost = cost;
        this.isDeleted = isDeleted;
        this.boughtQuantity = boughtQuantity;

        this.receipts = receipts;
        this.products = products;
    }
}

module.exports = {
    ProductReceipt: ProductReceipt
};

