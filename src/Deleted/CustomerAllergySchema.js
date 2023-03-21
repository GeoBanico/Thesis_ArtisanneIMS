const EntitySchema = require("typeorm").EntitySchema;
const CustomerAllergy = require("../model/CustomerAllergy").CustomerAllergy;
const CustomerHealth = require("../model/CustomerHealth").CustomerHealth;
const CustomerAllergyType = require("../model/CustomerAllergyType").CustomerAllergyType;

module.exports = new EntitySchema({
    name: "CustomerAllergy",
    target: CustomerAllergy,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        customerHealthId: {
            type: "int",
            nullable: true
        },
        allergyId: {
            type: "int",
            nullable: true
        },
        notes: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        healths: {
            target: "CustomerHealth",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        allergyTypes: {
            target: "CustomerAllergyType",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});