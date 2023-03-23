class BookService {
    constructor(id, serviceId, bookId, services, books) {
        this.id = id;
        
        this.serviceId = serviceId;
        this.bookId = bookId;

        this.services = services;
        this.books = books;
    }
}

module.exports = {
    BookService: BookService
};

