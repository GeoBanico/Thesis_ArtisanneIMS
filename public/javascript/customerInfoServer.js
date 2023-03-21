const config = require('../../src/index'), 
    Customer = require('../../src/model/Customer').Customer,
    Employee = require('../../src/model/Employee').Employee,
    CustomerStatus = require('../../src/model/CustomerStatus').CustomerStatus,
    EmployeeAccess = require('../../src/model/EmployeeAccess').EmployeeAccess,
    EmployeeShift = require('../../src/model/EmployeeShift').EmployeeShift,
    bcrypt = require('bcrypt');

//------------------------
//---------------CUSTOMER
//------------------------
const insertCustomer = async(customers) => {
    try {
        const insert = config.then(async function (connection){

            const customerRep = connection.getRepository(Customer);
            const [sameCustomer, duplicateCount] = await customerRep.findAndCountBy({
                username: customers.username
            })

            if(duplicateCount > 0){
                return true;
            }

            const statusRep = connection.getRepository(CustomerStatus);
            const customerStatus = await statusRep.findOneBy({
                type: customers.status
            })

            const salt = await bcrypt.genSalt();
            const newCustomer = new Customer();
            
            newCustomer.customerStatusId = customerStatus.id;
            newCustomer.firstName = customers.firstName;
            newCustomer.lastName = customers.lastName;
            newCustomer.birthday = customers.birthday;
            newCustomer.phone = customers.phone;
            newCustomer.address = customers.address;
            newCustomer.email = customers.email;
            newCustomer.username = customers.username;
            newCustomer.password = await bcrypt.hash(customers.password, salt);
            newCustomer.salt = salt;
            newCustomer.customerStatusId = customerStatus.id;
            newCustomer.statuses = customerStatus; 
            newCustomer.isDeleted = false;

            await connection.manager.save(newCustomer);

            return false;
        })

        return insert;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

const selectCustomerSpecific = async(customers) => {
    try {

        const select = config.then(async function (connection) {
            const userRep = connection.getRepository(Customer);
            const [user, userCount] = await userRep.findAndCountBy({username: `${customers.userEmail}`});
            const data = {user, userCount}
            
            return data;
        })
        
        return select

    } catch (error) {
        console.log('Login ERROR: ' + error);
    }
}

const searchForUserType = async(user) => {
    try {
        const search = config.then(async function (connection) {
            const employeeRep = connection.getRepository(Employee);
            const [employee, employeeCount] = await employeeRep.findAndCountBy(
                {
                    customerId: `${user.id}`,
                    isDeleted: false
                });
            
            if(employeeCount == 0) return 'Customer';

            if(await employee.customerAccessId == 1) return 'Employee';
            else if (employee.customerAccessId == 3) return 'Manager';
            else return 'Owner';
        })

        return search;
    } catch (error) {
        console.log('Login ERROR: ' + Error)
    }
}

const searchACustomerFromClick = async(customerId) => {
    try {
        const search = config.then(async function (connection) {
            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.find({
                where: {id: customerId.id},
                relations: ["statuses"]
            });
            
            return customer;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+ error);
    }
}

const selectCustomerAll = async() => {
    try {
        const search = config.then(async function (connection) {
            var customerList = []

            const employeeRep = connection.getRepository(Employee);
            const employee = await employeeRep.findBy({
                isDeleted: false
            });

            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.find({
                relations: ["statuses"]
            });

            var isEmployee = false;
            for (let c = 0; c < customer.length; c++) {
                for (let e = 0; e < employee.length; e++) {
                    if(employee[e].customerId == customer[c].id) {
                        isEmployee = true;
                        break;
                    }
                }
                if(!isEmployee) customerList.push(customer[c]);
                isEmployee = false;
            }

            return customerList;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+error);
    }
}

const searchSpecificCustomer = async(customerName) => {
    try {
        const search = config.then(async function (connection) {
            var allCustomers = await selectCustomerAll()

            var specificCustomer = new Array();

            allCustomers.forEach(customer => {
                var custFName = String(customer.firstName).toLowerCase();
                var custLName = String(customer.lastName).toLowerCase();
                if(custFName.includes(String(customerName.name).toLowerCase(),0) || custLName.includes(String(customerName.lastName).toLowerCase(),0)){
                    var jsonProd = new Object();
                    jsonProd.name = `${customer.id} | ${customer.firstName} ${customer.lastName}`;
                    specificCustomer.push(jsonProd);
                }
            });

            return specificCustomer;
        })

        return search;
    } catch (error) {
        console.log('')
    }
}

const insertCustomerToEmployee = async(customerName) => {
    try {
        config.then(async function (connection) {
            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.findOne({
                where:{id: customerName.id},
                relations: ["statuses"]
            })

            const accessRep = connection.getRepository(EmployeeAccess);
            const access = await accessRep.findOneBy({
                type: 'Employee'
            })

            const shiftRep = connection.getRepository(EmployeeShift);
            const shift = await shiftRep.findOneBy({
                id: 1
            })

            
            const newEmployee = new Employee();

            newEmployee.customerId = customerName.id;
            newEmployee.customerAccessId = 1;
            newEmployee.employeeShiftId = 1;
            newEmployee.salary = 0;
            newEmployee.customers = customer;
            newEmployee.accesses = access;
            newEmployee.shifts = shift;
            newEmployee.isDeleted = false;

            await connection.manager.save(newEmployee);
        })

    } catch (error) {
        console.log('')
    }
}

const updateCustomer = async(oldCustomers, newCustomer) => {
    try {
        config.then(async function (connection) {
            const prodCatRep = config.getRepository(ProductCategory);
            const prodCatToUpdate = await prodCatRep.findOneBy({
                name: OldProductCat.name,
            })
            prodCatToUpdate.name = NewProductCat.name
            await prodCatRep.save(prodCatToUpdate);
        })
        
    } catch (error) {
        console.log('select FB'+error);
    }
}

//---------------------------
//-------- EMPLOYEE ---------
//---------------------------
const selectEmployeeAll = async() => {
    try {
        const search = config.then(async function (connection) {
            const employeeRep = connection.getRepository(Employee);
            const employee = await employeeRep.find({
                where: {
                    isDeleted: false
                },
                relations: ["customers", "accesses", "shifts"]
            });

            return employee;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+error);
    }
}

const searchSpecificEmployee = async(employeeName) => {
    try {
        const search = config.then(async function (connection) {
            
            var allEmployee = await selectEmployeeAll()

            var specificEmployee = new Array();

            allEmployee.forEach(employee => {
                var empFname = String(employee.customers.firstName).toLowerCase();
                var empLname = String(employee.customers.lastName).toLowerCase();

                if(empFname.includes(String(employeeName.name).toLowerCase(),0) || empLname.includes(String(employeeName.name).toLowerCase(),0)){
                    console.log('enter');
                    var jsonProd = new Object();
                    jsonProd.name = `${employee.id} | ${employee.customers.firstName} ${employee.customers.lastName}`;
                    specificEmployee.push(jsonProd);
                }
            });

            return specificEmployee;
        })

        return search;
    } catch (error) {
        console.log('')
    }
}

const searchAEmployeeFromClick = async(employeeId) => {
    try {
        const search = config.then(async function (connection) {
            const employeeRep = connection.getRepository(Employee);
            const employee = await employeeRep.find({
                where: {
                    id: employeeId.id,
                    isDeleted: false
                },
                relations: ["customers", "accesses", "shifts"]
            });

            return employee;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+error);
    }
}

//Fill remove employee
const removeEmployee = async(employeeId) => {
    try {
        const remove = config.then(async function (connection) {
            const employeeRep = connection.getRepository(Employee);
            const employeeToUpdate = await employeeRep.findOneBy({
                id: employeeId.id
            });
            
            employeeToUpdate.isDeleted = true;

            await employeeRep.save(employeeToUpdate);
        })

    } catch (error) {
        console.log('remove customer error: '+error);
    }
}

//Fill employee access
const fillEmployeeAccess = async() => {
    try {
        const search = config.then(async function (connection) {
            const employeeAccessRep = connection.getRepository(EmployeeAccess);
            const employeeAccess = await employeeAccessRep.find();

            return employeeAccess;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+error);
    }
}
//Fill employee shifts
const fillEmployeeShifts = async() => {
    try {
        const search = config.then(async function (connection) {
            const employeeShiftRep = connection.getRepository(EmployeeShift);
            const employeeShift = await employeeShiftRep.find();

            return employeeShift;
        })

        return search;
    } catch (error) {
        console.log('select customer error: '+error);
    }
}


module.exports = {
    //Customer
    insertCustomer,
    selectCustomerSpecific,
    searchForUserType,
    selectCustomerAll,
    searchSpecificCustomer,
    searchACustomerFromClick,
    // updateCustomer,

    //Employee
    selectEmployeeAll,
    searchSpecificEmployee,
    searchAEmployeeFromClick,
    fillEmployeeAccess,
    fillEmployeeShifts,
    insertCustomerToEmployee,
    removeEmployee
}
