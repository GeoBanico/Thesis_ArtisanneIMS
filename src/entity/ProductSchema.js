const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Product = require("../model/Product").Product; // import {Category} from "../model/Category";
const ProductCategory = require("../model/ProductCategory").ProductCategory;

module.exports = new EntitySchema({
    name: "Product",
    target: Product,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        productCategoryId: {
            type: "int",
            nullable: true
        },
        name: {
            type: "nvarchar"
        },
        price: {
            type: "real"
        },
        description: {
            type: "nvarchar"
        },
        storeQuantity:{
            type: "int",
            nullable: true
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        categories: {
            target: "ProductCategory",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});