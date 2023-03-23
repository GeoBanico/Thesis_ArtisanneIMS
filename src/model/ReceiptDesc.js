class ReceiptDesc {
    constructor(id, type, receiptId, receipts) {
        this.id = id;
        this.type = type;

        this.receiptId = receiptId;

        this.receipts = receipts;
    }
}

module.exports = {
    ReceiptDesc: ReceiptDesc
};
