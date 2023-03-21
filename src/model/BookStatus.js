class BookStatus {
    constructor(id, type, isDeleted) {
        this.id = id;
        this.type = type;
        this.isDeleted = isDeleted;
    }
}

module.exports = {
    BookStatus: BookStatus
};

