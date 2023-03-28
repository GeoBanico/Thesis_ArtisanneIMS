var currentUser = {username:null, userType:null};

window.onload = async function windowLoad(){
    //userDetails Onload
    getUserDetails();

    //Service Onload
    refreshServiceList();

    //Product Onload
    refreshProductList();

    //customer Onload
    refreshCustomerList();

    //employee Onload
    refreshEmployeeList();

    //employee access onload
    fillEmployeeAccess();

    //employee shifts onload
    fillEmployeeShift()
}

//userDetails Onload
async function getUserDetails(){
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "username") {
            currentUser.username = decodeURIComponent(value);
        }
        if(name === 'userType'){
            currentUser.userType = decodeURIComponent(value);
        }
    }
    document.getElementById('username').innerHTML = currentUser.username;
    document.getElementById('userType').innerHTML = currentUser.userType;

    if(currentUser.userType == 'Manager' || currentUser.userType == 'Owner' ) {
        const changeDisplay = document.getElementsByClassName('forOwnerManager');
        for (let i = 0; i < changeDisplay.length; i++) {
            changeDisplay[i].style.display = 'block'
        }
    }
} 

//Service Onload
async function refreshServiceList() {
    const dataStream = await fillService();
    var selectBox = document.getElementById("allServiceList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });

    refreshMainServiceCategory()
}

async function fillService() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllService', options);
    const dataStream = await response.json();
    return dataStream;
}

async function refreshMainServiceCategory(){
    const dataStream = await fillServiceCategory();
    var selectBox = document.getElementById("serviceCategoryList");
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

    document.getElementById("allServiceCategory").value = '';
    document.getElementById("serviceCategory").value = '';
    serviceCategoryState.state = 'add';
    serviceCategoryState.toEdit = '';

    document.getElementById("serviceCategory").style.color = 'black'
    document.getElementById("addServiceCategory").style.display = 'none'
    document.getElementById("editServiceCategory").style.display = 'block'
    document.getElementById("deleteServiceCategory").style.display = 'block'
}

//Product Onload
async function refreshProductList() {
    const dataStream = await fillProduct();
    var selectBox = document.getElementById("allProductList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });

    refreshMainProductCategory()
}

async function fillProduct() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllProduct', options);
    const dataStream = await response.json();
    return dataStream;
}

async function refreshMainProductCategory(){
    const dataStream = await fillProductCategory();
    var selectBox = document.getElementById("productCategoryList");
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

    document.getElementById("allProductCategory").value = '';
    document.getElementById("productCategory").value = '';
    productCategoryState.state = 'add';
    productCategoryState.toEdit = '';

    document.getElementById("productCategory").style.color = 'black'
    document.getElementById("addProductCategory").style.display = 'none'
    document.getElementById("editProductCategory").style.display = 'block'
    document.getElementById("deleteProductCategory").style.display = 'block'
}

//Customer Onload
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

//Employee onload
async function refreshEmployeeList(){
    const dataStream = await fillEmployee();
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

async function fillEmployee() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllEmployee', options);
    const dataStream = await response.json();
    return dataStream;
}

async function fillEmployeeAccess() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/fillEmployeeAccess', options);
    const dataStream = await response.json();

    var selectBox = document.getElementById("employeeAccess");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'type') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });
}

async function fillEmployeeShift() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/fillEmployeeShift', options);
    const dataStream = await response.json();

    var selectBox = document.getElementById("employeeShift");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'type') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });
}