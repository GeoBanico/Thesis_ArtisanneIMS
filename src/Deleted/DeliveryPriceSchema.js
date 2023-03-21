const EntitySchema = require("typeorm").EntitySchema;
const DeliveryPrice = require("../model/DeliveryPrice").DeliveryPrice; // import {Category} from "../model/Category";
const DeliveryCompany = require("../model/DeliveryCompany").DeliveryCompany;

module.exports = new EntitySchema({
    name: "DeliveryPrice",
    target: DeliveryPrice,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        price: {
            type: "real"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        company: {
            target: "DeliveryCompany",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});