class BookService {
    constructor(id, serviceId, bookId, notes, services, books) {
        this.id = id;
        this.serviceId = serviceId;
        this.bookId = bookId;
        this.notes = notes;
        
        this.services = services;
        this.books = books;
    }
}

module.exports = {
    BookService: BookService
};

