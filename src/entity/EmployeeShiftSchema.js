const EntitySchema = require("typeorm").EntitySchema;
const EmployeeShift = require("../model/EmployeeShift").EmployeeShift; 

module.exports = new EntitySchema({
    name: "EmployeeShift",
    target: EmployeeShift,
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