const EntitySchema = require("typeorm").EntitySchema; 
const ServiceCategory = require("../model/ServiceCategory").ServiceCategory;

module.exports = new EntitySchema({
    name: "ServiceCategory",
    target: ServiceCategory,
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