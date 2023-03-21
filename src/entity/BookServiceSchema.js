const EntitySchema = require("typeorm").EntitySchema;
const BookService = require("../model/BookService").BookService;
const Book = require("../model/Book").Book;
const Service = require("../model/Service").Service;
const BookStatus = require("../model/BookStatus").BookStatus; 

module.exports = new EntitySchema({
    name: "BookService",
    target: BookService,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        serviceId: {
            type: "int",
            nullable: true
        },
        bookId: {
            type: "int",
        },
        notes: {
            type: "nvarchar"
        }
    },
    relations: {
        books: {
            target: "Book",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        services: {
            target: "Service",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});