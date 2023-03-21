class ProductReceipt {
    constructor(id, receiptId, productId, cost, isDeleted, receipts, products) {
        this.id = id;
        this.receiptId = receiptId;
        this.productId = productId;
        this.cost = cost;
        this.isDeleted = isDeleted;
        

        this.receipts = receipts;
        this.products = products;
    }
}

module.exports = {
    ProductReceipt: ProductReceipt
};

