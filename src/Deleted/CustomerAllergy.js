class CustomerAllergy {
    constructor(id, customerHealthId, allergyId, notes, healths, allergyTypes, isDeleted) {
        this.id = id;
        this.customerHealthId = customerHealthId;
        this.allergyId = allergyId;
        this.notes = notes;
        this.isDeleted = isDeleted;

        this.healths = healths;
        this.allergyTypes = allergyTypes;
    }
}

module.exports = {
    CustomerAllergy: CustomerAllergy
};

