class Receipt {
    constructor(id, receiptNumber, productReceiptId, serviceReceiptId, date, totalCost, productReceipts, serviceReceipts) {
        this.id = id;
        this.receiptNumber = receiptNumber;
        this.date = date;
        this.totalCost = totalCost;

        this.productReceiptId = productReceiptId;
        this.serviceReceiptId = serviceReceiptId;

        this.productReceipts = productReceipts;
        this.serviceReceipts = serviceReceipts;
    }
}

module.exports = {
    Receipt: Receipt
};

