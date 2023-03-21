class ServiceCategory {
    constructor(id, name, isDeleted) {
        this.id = id;
        this.name = name;
        this.isDeleted = isDeleted
    }
}

module.exports = {
    ServiceCategory: ServiceCategory
};

