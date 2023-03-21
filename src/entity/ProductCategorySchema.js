const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const ProductCategory = require("../model/ProductCategory").ProductCategory; // import {Category} from "../model/Category";

module.exports = new EntitySchema({
    name: "ProductCategory",
    target: ProductCategory,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    }
});