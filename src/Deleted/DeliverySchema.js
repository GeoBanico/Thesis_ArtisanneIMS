const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Delivery = require("../model/Delivery").Delivery; // import {Post} from "../model/Post";
const DeliveryStatus = require("../model/DeliveryStatus").DeliveryStatus;
const DeliveryCompany = require("../model/DeliveryCompany").DeliveryCompany;
const SalesProduct = require("../model/SalesProduct").SalesProduct;

module.exports = new EntitySchema({
    name: "Delivery",
    target: Delivery,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        deliveryStatusId: {
            type: "int",
            nullable: true
        },
        deliveryCompanyId: {
            type: "int",
            nullable: true
        },
        salesProductId: {
            type: "int",
            nullable: true
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        deliveryStatuses: {
            target: "DeliveryStatus",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }, companyNames: {
            target: "DeliveryCompany",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});