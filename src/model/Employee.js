class Employee {
    constructor(id, customerId, customerAccessId, employeeShiftId, salary, customers, accesses, shifts, isDeleted) {
        this.id = id;
        this.customerId = customerId;
        this.customerAccessId = customerAccessId;
        this.employeeShiftId = employeeShiftId;
        this.salary = salary;
        this.isDeleted = isDeleted;

        this.customers = customers;
        this.accesses = accesses;
        this.shifts = shifts;
    }
}

module.exports = {
    Employee: Employee
};

