const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const SalesProduct = require("../model/SalesProduct").SalesProduct; // import {Post} from "../model/Post";
const Product = require("../model/Product").Product; // import {Category} from "../model/Category";
const Receipt = require("../model/Receipt").Receipt; // import {Category} from "../model/Category";
const Delivery = require("../model/Delivery").Delivery;

module.exports = new EntitySchema({
    name: "SalesProduct",
    target: SalesProduct,
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
            nullable: true
        },
        total: {
            type: "real"
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
        },
        deliveries: {
            target: "Delivery",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});