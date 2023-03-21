const EntitySchema = require("typeorm").EntitySchema;
const CustomerHealth = require("../model/CustomerHealth").CustomerHealth;
const Customer = require("../model/Customer").Customer;
const CustomerAllergy = require("../model/CustomerAllergy").CustomerAllergy;

module.exports = new EntitySchema({
    name: "CustomerHealth",
    target: CustomerHealth,
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
        customerAllergyId: {
            type: "int",
            nullable: true
        },
        notes: {
            type: "nvarchar"
        },
        hasConsent: {
            type: "image"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        customers: {
            target: "Customer",
            type: "one-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        allergies: {
            target: "CustomerAllergy",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});