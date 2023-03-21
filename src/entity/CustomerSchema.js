const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Customer = require("../model/Customer").Customer; // import {Category} from "../model/Category";
const CustomerStatus = require("../model/CustomerStatus").CustomerStatus;

module.exports = new EntitySchema({
    name: "Customer",
    target: Customer,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        customerStatusId: {
            type: "int",
            nullable: true
        },
        firstName: {
            type: "nvarchar"
        },
        lastName: {
            type: "nvarchar"
        },
        birthday: {
            type: "datetime"
        },
        phone: {
            type: "nvarchar"
        },
        address: {
            type: "nvarchar"
        },
        email: {
            type: "nvarchar"
        },
        username: {
            type: "nvarchar"
        },
        password: {
            type: "nvarchar"
        },
        salt: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        statuses: {
            target: "CustomerStatus",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});