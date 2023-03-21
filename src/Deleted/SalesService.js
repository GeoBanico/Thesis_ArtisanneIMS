class SalesService {
    constructor(id, receiptId, serviceId, total, receipts, services) {
        this.id = id;
        this.receiptId = receiptId;
        this.serviceId = serviceId;
        this.total = total;
        this.receipts = receipts;
        this.services = services;
    }
}

module.exports = {
    SalesService: SalesService
};

