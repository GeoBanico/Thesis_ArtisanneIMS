const EntitySchema = require("typeorm").EntitySchema;
const CustomerAllergyType = require("../model/CustomerAllergyType").CustomerAllergyType; 

module.exports = new EntitySchema({
    name: "CustomerAllergyType",
    target: CustomerAllergyType,
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