class Book {
    constructor(id, customerId, bookServiceId, bookStatusId, bookDate, bookStartTime, isDeleted, customers, bookServices, bookStatuses) {
        this.id = id;
        this.customerId = customerId;
        this.bookServiceId = bookServiceId;
        this.bookStatusId = bookStatusId
        this.bookDate = bookDate;
        this.bookStartTime = bookStartTime;
        this.isDeleted = isDeleted;

        this.customers = customers;
        this.bookServices = bookServices;
        this.bookStatuses = bookStatuses;
    }
}

module.exports = {
    Book: Book
};

