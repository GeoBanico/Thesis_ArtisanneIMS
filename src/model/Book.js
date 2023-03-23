class Book {
    constructor(id, customerId, bookServiceId, bookStatusId, bookDate, bookStartTime, isDeleted, customers, bookServices, bookStatuses) {
        this.id = id;
        this.bookDate = bookDate;
        this.bookStartTime = bookStartTime;
        this.isDeleted = isDeleted;

        this.customerId = customerId;
        this.bookServiceId = bookServiceId; //nullable
        this.bookStatusId = bookStatusId

        this.customers = customers;
        this.bookServices = bookServices; //nullable
        this.bookStatuses = bookStatuses;
    }
}

module.exports = {
    Book: Book
};

