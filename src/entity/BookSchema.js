const EntitySchema = require("typeorm").EntitySchema;
const Book = require("../model/Book").Book;
const Customer = require("../model/Customer").Customer;
const BookService = require("../model/BookService").BookService;
const BookStatus = require("../model/BookStatus").BookStatus;

module.exports = new EntitySchema({
    name: "Book",
    target: Book,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        customerId: {
            type: "int",
            nullable: true
        },
        bookServiceId: {
            type: "int"
        },
        bookStatusId: {
            type: "int",
        },
        bookDate: {
            type: "datetime"
        },
        bookStartTime: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        customers: {
            target: "Customer",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        bookServices: {
            target: "BookService",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        bookStatuses: {
            target: "BookStatus",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});