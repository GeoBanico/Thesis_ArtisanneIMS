const EntitySchema = require("typeorm").EntitySchema;
const Receipt = require("../model/Receipt").Receipt;
const Customer = require("../model/Customer").Customer;
const ProductReceipt = require("../model/ProductReceipt").ProductReceipt;
const ServiceReceipt = require("../model/ServiceReceipt").ServiceReceipt;

module.exports = new EntitySchema({
    name: "Receipt",
    target: Receipt,
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
        productReceiptId: {
            type: "int",
            nullable: true
        },
        serviceReceiptId: {
            type: "int",
            nullable: true
        },
        date: {
            type: "datetime"
        },
        totalCost: {
            type: "real"
        }
    },
    relations: {
        productReceipts: {
            target: "ProductReceipt",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true,
            nullable: true
        },
        serviceReceipts: {
            target: "ServiceReceipt",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true,
            nullable: true
        }
    }
});