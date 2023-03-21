class Receipt {
    constructor(id, productReceiptId, serviceReceiptId, date, totalCost, customers, productReceipts, serviceReceipts) {
        this.id = id;
        this.productReceiptId = productReceiptId;
        this.serviceReceiptId = serviceReceiptId;
        this.date = date;
        this.totalCost = totalCost;

        this.productReceipts = productReceipts;
        this.serviceReceipts = serviceReceipts;
    }
}

module.exports = {
    Receipt: Receipt
};

