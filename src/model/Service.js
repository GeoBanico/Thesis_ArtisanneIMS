class Service {
    constructor(id, serviceCategoryId, name, price, duration, description, categories, isDeleted) {
        this.id = id;
        this.serviceCategoryId = serviceCategoryId;
        this.name = name;
        this.price = price;
        this.duration = duration;
        this.description = description;
        this.isDeleted = isDeleted;

        this.categories = categories;
    }
}

module.exports = {
    Service: Service
};

