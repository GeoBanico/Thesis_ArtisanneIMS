class Product {
    constructor(id, productCategoryId, name, price, description, storeQuantity, categories, isDeleted) {
        this.id = id;
        this.productCategoryId = productCategoryId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.isDeleted = isDeleted;
        this.storeQuantity = storeQuantity;

        this.categories = categories;
    }
}

module.exports = {
    Product: Product
};

