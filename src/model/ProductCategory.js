class ProductCategory {
    constructor(id, name, isDeleted) {
        this.id = id;
        this.name = name;
        this.isDeleted = isDeleted
    }
}

module.exports = {
    ProductCategory: ProductCategory
};

