const EntitySchema = require("typeorm").EntitySchema;
const EmployeeAccess = require("../model/EmployeeAccess").EmployeeAccess; 

module.exports = new EntitySchema({
    name: "EmployeeAccess",
    target: EmployeeAccess,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        type: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    }
});