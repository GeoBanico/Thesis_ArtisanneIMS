async function keyPressCustomerSearch(){
    var name = document.getElementById("txtSearchCustomer").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllCustomers', options);
        const dataStream = await response.json();

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

async function getInfoFromClickedCustomerList(){
    var values = document.getElementById("allCustomerList").value;
    var valuesArr = values.split(" ");
    var id = valuesArr[0];

    var data = {id};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/searchACustomerFromClick', options);
    const dataStream = await response.json();
    
    const bday = await dataStream[0].birthday;
    const bdayArr = bday.split("T");

    document.getElementById("customerFirstName").value = await dataStream[0].firstName;
    document.getElementById("customerLastName").value = await dataStream[0].lastName;
    document.getElementById("customerBirthday").value = bdayArr[0];
    document.getElementById("customerPhone").value = await dataStream[0].phone;
    document.getElementById("customerEmail").value = await dataStream[0].email;
    document.getElementById("customerStatus").value = await dataStream[0].statuses.type;
}