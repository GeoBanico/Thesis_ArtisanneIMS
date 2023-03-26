class Cart {
    constructor(id, customerId, deliveryStatusId, orderNumber, dateOrdered, dateDelivered, isDeleted, customers, deliveryStatuses) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.dateOrdered = dateOrdered;
        this.dateDelivered = dateDelivered;
        this.isDeleted = isDeleted;

        this.customerId = customerId;
        this.deliveryStatusId = deliveryStatusId;

        this.customers = customers;
        this.deliveryStatuses = deliveryStatuses;
    }
}

module.exports = {
    Cart: Cart
};
