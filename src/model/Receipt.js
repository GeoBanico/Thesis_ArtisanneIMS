class Receipt {
    constructor(id, receiptNumber, productReceiptId, serviceReceiptId, date, discount, totalCost, productReceipts, serviceReceipts) {
        this.id = id;
        this.receiptNumber = receiptNumber;
        this.date = date;
        this.discount = discount;
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

