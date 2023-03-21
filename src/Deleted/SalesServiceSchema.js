const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const SalesService = require("../model/SalesService").SalesService; // import {Post} from "../model/Post";
const Service = require("../model/Service").Service; // import {Category} from "../model/Category";
const Receipt = require("../model/Receipt").Receipt; // import {Category} from "../model/Category";

module.exports = new EntitySchema({
    name: "SalesService",
    target: SalesService,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        receiptId:{
            type: "int",
            nullable: true
        },
        serviceId:{
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
        services: {
            target: "Service",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
    }
});