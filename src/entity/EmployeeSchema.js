const EntitySchema = require("typeorm").EntitySchema;
const Employee = require("../model/Employee").Employee;
const Customer = require("../model/Customer").Customer;
const EmployeeAccess = require("../model/EmployeeAccess").EmployeeAccess;
const EmployeeShift = require("../model/EmployeeShift").EmployeeShift;

module.exports = new EntitySchema({
    name: "Employee",
    target: Employee,
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
        customerAccessId: {
            type: "int",
            nullable: true
        },
        employeeShiftId: {
            type: "int",
            nullable: true
        },
        salary: {
            type: "real"
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        customers: {
            target: "Customer",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        accesses: {
            target: "EmployeeAccess",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        shifts: {
            target: "EmployeeShift",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});