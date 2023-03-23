class Cart {
    constructor(id, customerId, cartProductId, deliveryStatusId, orderNumber, dateOrdered, dateDelivered, isDeleted, customers, cartProducts, deliveryStatuses) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.dateOrdered = dateOrdered;
        this.dateDelivered = dateDelivered;
        this.isDeleted = isDeleted;

        this.customerId = customerId;
        this.cartProductId = cartProductId;
        this.deliveryStatusId = deliveryStatusId;

        this.customers = customers;
        this.cartProducts = cartProducts;
        this.deliveryStatuses = deliveryStatuses;
    }
}

module.exports = {
    Cart: Cart
};
