const e = require("express");

class CustomerStatus {
    constructor(id, type, isDeleted) {
        this.id = id;
        this.type = type;
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    CustomerStatus: CustomerStatus
};

