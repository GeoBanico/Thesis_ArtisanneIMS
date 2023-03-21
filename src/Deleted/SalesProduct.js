class SalesProduct {
    constructor(id, receiptId, productId, total, receipts, products, deliveries) {
        this.id = id;
        this.receiptId = receiptId;
        this.productId = productId;
        this.total = total;
        this.receipts = receipts;
        this.products = products;
        this.deliveries = deliveries;
    }
}

module.exports = {
    SalesProduct: SalesProduct
};

