const EntitySchema = require("typeorm").EntitySchema;
const ProductReceipt = require("../model/ProductReceipt").ProductReceipt;
const Product = require("../model/Product").Product;
const Receipt = require("../model/Receipt").Receipt;

module.exports = new EntitySchema({
    name: "ProductReceipt",
    target: ProductReceipt,
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
        productId: {
            type: "int",
        },
        cost: {
            type: "float",
        },
        boughtQuantity: {
            type: "int",
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
        products: {
            target: "Product",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});