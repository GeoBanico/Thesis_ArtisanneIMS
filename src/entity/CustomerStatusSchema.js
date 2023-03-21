const EntitySchema = require("typeorm").EntitySchema;
const CustomerStatus = require("../model/CustomerStatus").CustomerStatus; // import {Category} from "../model/Category";

module.exports = new EntitySchema({
    name: "CustomerStatus",
    target: CustomerStatus,
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