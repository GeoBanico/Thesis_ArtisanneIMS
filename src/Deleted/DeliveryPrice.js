class DeliveryPrice {
    constructor(id, price, company, isDeleted) {
        this.id = id;
        this.price = price;
        this.company = company
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    DeliveryPrice: DeliveryPrice
};

