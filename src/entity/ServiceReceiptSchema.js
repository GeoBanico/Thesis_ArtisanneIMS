const EntitySchema = require("typeorm").EntitySchema;
const ServiceReceipt = require("../model/ServiceReceipt").ServiceReceipt;
const Service = require("../model/Service").Service;
const Receipt = require("../model/Receipt").Receipt;

module.exports = new EntitySchema({
    name: "ServiceReceipt",
    target: ServiceReceipt,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        receiptId: {
            type: "int",
            nullable: true
        },
        serviceId: {
            type: "int",
        },
        cost: {
            type: "real",
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        receipts: {
            target: "Receipt",
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