class ServiceReceipt {
    constructor(id, receiptId, serviceId, cost, isDeleted, receipts, services) {
        this.id = id;
        this.receiptId = receiptId;
        this.serviceId = serviceId;
        this.cost = cost;
        this.isDeleted = isDeleted;

        this.receipts = receipts;
        this.services = services;
    }
}

module.exports = {
    ServiceReceipt: ServiceReceipt
};

