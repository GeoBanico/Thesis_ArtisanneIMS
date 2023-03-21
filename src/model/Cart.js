class Cart {
    constructor(id, customerId, productId, deliveryStatusId, orderNumber, dateOrdered, dateDelivered, isDeleted, customers, products, deliveryStatuses) {
        this.id = id;
        this.customerId = customerId;
        this.productId = productId;
        this.deliveryStatusId = deliveryStatusId;
        this.orderNumber = orderNumber;
        this.dateOrdered = dateOrdered;
        this.dateDelivered = dateDelivered;
        this.isDeleted = isDeleted;

        this.customers = customers;
        this.products = products;
        this.deliveryStatuses = deliveryStatuses;
    }
}

module.exports = {
    Cart: Cart
};
