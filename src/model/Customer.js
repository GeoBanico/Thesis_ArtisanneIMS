class Customer {
    constructor(id, customerStatusId, firstName, lastName, birthday, phone, address, email, username, password, salt, statuses, isDeleted) {
        this.id = id;
        this.customerStatusId = customerStatusId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.phone = phone;
        this.address = address;
        this.email = email;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.isDeleted = isDeleted;

        this.statuses = statuses;
    }
} 

module.exports = {
    Customer: Customer
};

