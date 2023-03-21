class CustomerHealth {
    constructor(id, customerId, customerAllergyId, notes, hasConsent, customers, allergies, isDeleted) {
        this.id = id;
        this.customerId = customerId;
        this.customerAllergyId = customerAllergyId;
        this.notes = notes;
        this.hasConsent = hasConsent;
        this.customers = customers;
        this.allergies = allergies;
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    CustomerHealth: CustomerHealth
};

