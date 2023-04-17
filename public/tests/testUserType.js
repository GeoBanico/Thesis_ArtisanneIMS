const config = require('../../src/index'), 
    Employee = require('../../src/model/Employee').Employee;

async function testUserType(userId){
    const search = config.then(async function (connection) {
        const employeeRep = connection.getRepository(Employee);
        const [employee, employeeCount] = await employeeRep.findAndCountBy(
            {
                customerId: `${userId}`,
                isDeleted: false
            })

        if(employeeCount == 0) return 'Customer';
        if (await employee[0].customerAccessId == 1) return 'Employee';
        else if (employee[0].customerAccessId == 3) return 'Manager';
        else return 'Owner';
    })

    return search;
}

module.exports = testUserType;