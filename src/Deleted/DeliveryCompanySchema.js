const EntitySchema = require("typeorm").EntitySchema;
const DeliveryCompany = require("../model/DeliveryCompany").DeliveryCompany; // import {Post} from "../model/Post";
const DeliveryPrice = require("../model/DeliveryPrice").DeliveryPrice; // import {Category} from "../model/Category";

module.exports = new EntitySchema({
    name: "DeliveryCompany",
    target: DeliveryCompany,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        deliveryPricesId: {
            type: "int",
            nullable: true
        },
        name: {
            type: "nvarchar"
        },
        location: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        pricings: {
            target: "DeliveryPrice",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});