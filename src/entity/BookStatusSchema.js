const EntitySchema = require("typeorm").EntitySchema;
const BookStatus = require("../model/BookStatus").BookStatus; 

module.exports = new EntitySchema({
    name: "BookStatus",
    target: BookStatus,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        type: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    }
});