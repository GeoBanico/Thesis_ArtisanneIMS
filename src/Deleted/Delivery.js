class Delivery {
    constructor(id, salesProductId, deliveryCompanyId, deliveryStatusId, deliveryStatuses, companyNames, isDeleted) {
        this.id = id;
        this.deliveryStatusId = deliveryStatusId;
        this.deliveryCompanyId = deliveryCompanyId;
        this.salesProductId = salesProductId;
        this.deliveryStatuses = deliveryStatuses;
        this.companyNames = companyNames;
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    Delivery: Delivery
};

