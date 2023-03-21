class DeliveryCompany {
    constructor(id, deliveryPricesId, name, location, pricings, isDeleted) {
        this.id = id;
        this.deliveryPricesId = deliveryPricesId;
        this.name = name;
        this.location = location;
        this.pricings = pricings;
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    DeliveryCompany: DeliveryCompany
};

