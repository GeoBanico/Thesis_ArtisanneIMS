class Receipt {
    constructor(id, productReceiptId, serviceReceiptId, date, totalCost, receiptDescId, receiptDescs, productReceipts, serviceReceipts) {
        this.id = id;
        this.date = date;
        this.totalCost = totalCost;

        this.productReceiptId = productReceiptId;
        this.serviceReceiptId = serviceReceiptId;
        this.receiptDescId = receiptDescId;

        this.productReceipts = productReceipts;
        this.serviceReceipts = serviceReceipts;
        this.receiptDescs = receiptDescs;
    }
}

module.exports = {
    Receipt: Receipt
};

