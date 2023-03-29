async function fillEmployee() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllEmployee', options);
    const dataStream = await response.json();
    return await dataStream;
}

async function refreshMainEmployee(){
    const dataStream = await fillEmployee();
    var selectBox = document.getElementById("allEmployeeList");
    
    while(selectBox.options.length > 0){  selectBox.remove(0) }
    
    var customerDetails = '';
        await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'id') {
                customerDetails += `${value} | `
            }
            if(key == 'customers') {
                customerDetails += `${value.firstName} ${value.lastName}`
            }
        });
        var option = document.createElement("option");
        option.text = customerDetails;
        option.value = customerDetails;
        selectBox.add(option);
        customerDetails = ''
    });
}

async function keyPressEmployeeSearch(){
    var name = document.getElementById("txtSearchEmployee").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllEmployee', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allEmployeeList");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        var customerDetails = '';
        await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'id') {
                customerDetails += `${value} | `
            }
            if(key == 'customers') {
                customerDetails += `${value.firstName} ${value.lastName}`
            }
        });
        var option = document.createElement("option");
        option.text = customerDetails;
        option.value = customerDetails;
        selectBox.add(option);
        customerDetails = ''
    });
    }
    else{
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificEmployee', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allEmployeeList");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
}

async function getInfoFromClickedEmployeeList(){
    var values = document.getElementById("allEmployeeList").value;
    var valuesArr = values.split(" ");
    var id = valuesArr[0];

    var data = {id};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/searchAEmployeeFromClick', options);
    const dataStream = await response.json();
    
    const bday = await dataStream[0].customers.birthday;
    const bdayArr = bday.split("T");

    document.getElementById("employeeFirstName").value = await dataStream[0].customers.firstName;
    document.getElementById("employeeLastName").value = await dataStream[0].customers.lastName;
    document.getElementById("employeeBirthday").value = bdayArr[0];
    document.getElementById("employeePhone").value = await dataStream[0].customers.phone;
    document.getElementById("employeeEmail").value = await dataStream[0].customers.email;
    document.getElementById("employeeAccess").value = await dataStream[0].accesses.type;
    document.getElementById("employeeSalary").value = await dataStream[0].salary;
    document.getElementById("employeeShift").value = await dataStream[0].shifts.type;
}



async function addEmployee(){
    await refreshCustomerEmployeeList()

    document.getElementById("addEmployeeClick").style.display = 'none';
    document.getElementById("editEmployeeClick").style.display = 'none';
    document.getElementById("deleteEmployeeClick").style.display = 'none';
    document.getElementById("closeEmployeeClick").style.display = 'block';
    document.getElementById("saveEmployeeClick").style.display = 'block';
    document.getElementById("editableCustomerEmployee").style.display = 'block';
}

async function editEmployee() {
    var name = document.getElementById("allEmployeeList").value;
    if(name == '') alert('Please select a Employee')
    else {
        serviceState.state = 'edit';
        serviceState.toEdit = name;

        document.getElementById("addEmployeeClick").style.display = 'none';
        document.getElementById("editEmployeeClick").style.display = 'none';
        document.getElementById("deleteEmployeeClick").style.display = 'none';
        document.getElementById("closeEmployeeClick").style.display = 'block';
        document.getElementById("saveEmployeeClick").style.display = 'block';
        document.getElementById("employeeAccess").disabled = false;
        document.getElementById("employeeSalary").disabled = false;
        document.getElementById("employeeShift").disabled = false;
        document.getElementById("allEmployeeList").disabled = true;
    }
}

async function removeEmployee(){
    var data = document.getElementById("allEmployeeList").value;
    if(data == '') return alert('Please select a Employee')
    var empArray = data.split(" | ");
    var id = empArray[0];
    var name = empArray[1];
    if (!confirm(`Are you sure to delete the Employee: ${name}?`)) return
    var data = {id};
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/removeEmployee', options);
    const datastream = await response.json()
    console.log(datastream);

    refreshMainEmployee();
    closeEmployee();
    refreshCustomerList()
}

async function closeEmployee(){
    document.getElementById("serviceCategory").style.color = 'black';
    document.getElementById("addEmployeeClick").style.display = 'block';
    document.getElementById("editEmployeeClick").style.display = 'block';
    document.getElementById("deleteEmployeeClick").style.display = 'block';
    document.getElementById("closeEmployeeClick").style.display = 'none';
    document.getElementById("saveEmployeeClick").style.display = 'none';
    document.getElementById("editableCustomerEmployee").style.display = 'none';
    
    document.getElementById("allEmployeeList").disabled = false;;
    document.getElementById("employeeAccess").disabled = true;
    document.getElementById("employeeSalary").disabled = true;
    document.getElementById("employeeShift").disabled = true;
}

async function saveEmployee(){
    var access = document.getElementById("employeeAccess").value;
    var salary = document.getElementById("employeeSalary").value
    var shift = document.getElementById("employeeShift").value;
    var employeeList = document.getElementById("allEmployeeList").value.split(" | ");
    var empId = employeeList[0]; //0: Id | 1: nAME

    if(parseFloat(salary) < 0) return alert("Negative Salaray detected");

    var data = {empId, access, salary, shift}

    console.log(data);

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/editEmployee', options);
    const dataStream = await response.json();

    closeEmployee();
}

//Customer Employee
async function txtsearchCustomerEmployee(){
    var name = document.getElementById("txtSearchCustomer").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllCustomers', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allCustomerEmployee");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        var customerDetails = '';
        await dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'id') {
                    customerDetails += `${value} | `
                }
                if(key == 'firstName') {
                    customerDetails += `${value} `
                }
                if(key == 'lastName') {
                    customerDetails += `${value}`
                }
            });
            var option = document.createElement("option");
            option.text = customerDetails;
            option.value = customerDetails;
            selectBox.add(option);
            customerDetails = ''
        });
    }
    else{
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificCustomer', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allCustomerList");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
}

//Customer
async function refreshCustomerEmployeeList(){
    const dataStream = await fillCustomerEmployee();
    var selectBox = document.getElementById("allCustomerEmployee");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    var customerDetails = '';
    await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'id') {
                customerDetails += `${value} | `
                
            }
            if(key == 'firstName') {
                customerDetails += `${value} `
                
            }
            if(key == 'lastName') {
                customerDetails += `${value}`
            }
        });
        var option = document.createElement("option");
        option.text = customerDetails;
        option.value = customerDetails;
        selectBox.add(option);
        customerDetails = ''
    });
}

async function fillCustomerEmployee() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllCustomers', options);
    const dataStream = await response.json();
    console.log(dataStream);
    return dataStream;
}

async function keyPressCustomerEmployeeSearch(){
    var name = document.getElementById("txtsearchCustomerEmployee").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllCustomers', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allCustomerEmployee");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        var customerDetails = '';
        await dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'id') {
                    customerDetails += `${value} | `
                }
                if(key == 'firstName') {
                    customerDetails += `${value} `
                }
                if(key == 'lastName') {
                    customerDetails += `${value}`
                }
            });
            var option = document.createElement("option");
            option.text = customerDetails;
            option.value = customerDetails;
            selectBox.add(option);
            customerDetails = ''
        });
    }
    else{
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificCustomer', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allCustomerEmployee");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
}

async function customerToEmployee(){
    var values = document.getElementById("allCustomerEmployee").value;
    var valuesArr = values.split(" ");
    var id = valuesArr[0];

    var data = {id};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/insertCustomerToEmployee', options);
    const datastream = await response.json();
    console.log(await datastream);
    
    refreshMainEmployee();
    closeEmployee();
    refreshCustomerList()
}

async function refreshCustomerList(){
    const dataStream = await fillCustomer();
    var selectBox = document.getElementById("allCustomerList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    var customerDetails = '';
    await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'id') {
                customerDetails += `${value} | `
                
            }
            if(key == 'firstName') {
                customerDetails += `${value} `
                
            }
            if(key == 'lastName') {
                customerDetails += `${value}`
            }
        });
        var option = document.createElement("option");
        option.text = customerDetails;
        option.value = customerDetails;
        selectBox.add(option);
        customerDetails = ''
    });
}

async function fillCustomer() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllCustomers', options);
    const dataStream = await response.json();
    return dataStream;
}


