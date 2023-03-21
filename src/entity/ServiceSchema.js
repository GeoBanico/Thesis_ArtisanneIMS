const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const Service = require("../model/Service").Service; // import {Category} from "../model/Category";
const ServiceCategory = require("../model/ServiceCategory").ServiceCategory;

module.exports = new EntitySchema({
    name: "Service",
    target: Service,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        serviceCategoryId: {
            type: "int",
            nullable: true
        },
        name: {
            type: "nvarchar"
        },
        price: {
            type: "real"
        },
        duration: {
            type: "int"
        },
        description: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        categories: {
            target: "ServiceCategory",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true,
        }
    }
});