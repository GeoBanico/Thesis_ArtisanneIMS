//------------------------------------
//---------------- SERVICE -----------
//------------------------------------

var serviceCategoryState = { state:'add', toEdit:''}
var serviceState = { state:'add', toEdit:''}

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

async function clearServiceInputs(){
    document.getElementById("allServiceList").value = '';
    document.getElementById("serviceName").value = '';
    document.getElementById("servicePrice").value = '';
    document.getElementById("serviceDuration").value = '';
    document.getElementById("serviceDescription").value = '';
    document.getElementById("serviceCategoryList").value = '';

    disableServiceComponents()
}

async function enableServiceComponents(){
    document.getElementById("allServiceList").value = '';

    document.getElementById("serviceName").disabled = false;
    document.getElementById("servicePrice").disabled = false;
    document.getElementById("serviceDuration").disabled = false;
    document.getElementById("serviceDescription").disabled = false;
    document.getElementById("serviceCategoryList").disabled = false;
    document.getElementById("addServiceCategoryToDatabase").disabled = false;

    document.getElementById("allServiceList").disabled = true;
    document.getElementById("saveServiceClick").style.display = 'block';
}

async function disableServiceComponents(){
    document.getElementById("allServiceList").value = '';

    document.getElementById("serviceName").disabled = true;
    document.getElementById("servicePrice").disabled = true;
    document.getElementById("serviceDuration").disabled = true;
    document.getElementById("serviceDescription").disabled = true;
    document.getElementById("serviceCategoryList").disabled = true;
    document.getElementById("addServiceCategoryToDatabase").disabled = true;

    document.getElementById("allServiceList").disabled = false;
    document.getElementById("saveServiceClick").style.display = 'none';
}

async function keyPressServiceSearch(){
    var name = document.getElementById("txtSearchService").value;
    if(name == ""){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

        const response = await fetch('/searchAllService', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allServiceList");
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

        return;
    }
    else {
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/quickSearchService', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allServiceList");
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

async function getInfoFromClickedServiceList(){
    var name = document.getElementById("allServiceList").value;
    var data = {name};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/searchAService', options);
    const dataStream = await response.json();

    document.getElementById("serviceName").value = await dataStream[0].name;
    document.getElementById("servicePrice").value = await dataStream[0].price;
    document.getElementById("serviceDuration").value = await dataStream[0].duration;
    document.getElementById("serviceDescription").value = await dataStream[0].description;
    document.getElementById("serviceCategoryList").value = await dataStream[0].categories.name;
}

function missingData(data){
    var missingVariable = "";
    Object.entries(data).forEach(([key, value]) => {
            if (key != 'isDeleted' && value == '') {
                missingVariable += `- ${key}\n`
            }
    });

    return missingVariable;
}

//Save Service
document.getElementById("saveServiceClick").onclick = async function() {
    var name = document.getElementById("serviceName").value;
    var price = document.getElementById("servicePrice").value;
    var duration = document.getElementById("serviceDuration").value;
    var description = document.getElementById("serviceDescription").value;
    var categories = document.getElementById("serviceCategoryList").value;
    var isDeleted = false;

    var dataTest = {name, price, duration, description, categories, isDeleted};
    var hasMissingData = missingData(dataTest);
    if(hasMissingData != '') return alert(`EMPTY FIELDS! \nThere are empty fields in this category/ies: \n${hasMissingData}`);

    if(!(Number.isInteger(parseInt(price)) && price > 0)){
        alert(`Invalid Price (${price}): \nKindly select a number greater than 0 for the Price.`);
        return;
    }

    if(!(Number.isInteger(parseInt(duration)) && duration > 0)){
        alert(`Invalid Duration (${duration}): \nKindly select a number greater than 0 for the Duration.`);
        return;
    }

    if(serviceState.state=='add') {
        var data = {name, price, duration, description, categories, isDeleted};
    
        const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        };

        const response = await fetch('/addService', options);
        const dataStream = await response.json();

        if(await dataStream.message == 'duplicate'){
            alert('This Service already exists');
            return;
        }
        
    }
    else if(serviceState.state == 'edit') {
        var oldName = serviceState.toEdit;
        var data = {name, price, duration, description, categories, isDeleted, oldName};
        
        console.log(data);

        const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        };

        const response = await fetch('/editService', options);
        const dataStream = await response.json();
    }

    closeService();
    refreshServiceList();
}

async function addService(){
    serviceState.state = 'add';
    serviceState.toEdit = '';
    await refreshMainServiceCategory()
    clearServiceInputs()
    enableServiceComponents()

    document.getElementById("addServiceClick").style.display = 'none';
    document.getElementById("editServiceClick").style.display = 'none';
    document.getElementById("deleteServiceClick").style.display = 'none';
    document.getElementById("closeServiceClick").style.display = 'block';
}

async function editService() {
    var name = document.getElementById("allServiceList").value;
    if(name == '') console.log('Please select a Service')
    else {
        serviceState.state = 'edit';
        serviceState.toEdit = name;
        await refreshMainServiceCategory()
        enableServiceComponents()

        document.getElementById("serviceCategory").style.color = 'blue';
        document.getElementById("addServiceClick").style.display = 'none';
        document.getElementById("editServiceClick").style.display = 'none';
        document.getElementById("deleteServiceClick").style.display = 'none';
        document.getElementById("closeServiceClick").style.display = 'block';

        document.getElementById("serviceCategory").value = name;
    }
}

async function deleteService(){
    var name = document.getElementById("allServiceList").value;
    if(name == '') alert('Please select a Service')
    else {
        if (confirm(`Are you sure to delete the Service ${name}?`) == true) {
            var data = {name};
            const options =  {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
                body: JSON.stringify(data)
                };
    
            await fetch('/deleteService', options);

            closeService();
            refreshServiceList();
        }
    }
}

async function closeService(){
    document.getElementById("serviceCategory").style.color = 'black';
    document.getElementById("addServiceClick").style.display = 'block';
    document.getElementById("editServiceClick").style.display = 'block';
    document.getElementById("deleteServiceClick").style.display = 'block';
    document.getElementById("closeServiceClick").style.display = 'none';
    document.getElementById("serviceCategoryHidden").style.display = 'none';

    clearServiceInputs();
}

//---------------------------------------------
//---------------- SERVICE CATEGORY -----------
//---------------------------------------------
//Textbox per key stroke
async function keyPressServiceCategorySearch(){
    var name = document.getElementById("txtsearchServiceCategory").value;
    if(name == ""){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

        const response = await fetch('/searchAllServiceCategory', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allServiceCategory");
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

        return;
    }
    else {
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificServiceCategory', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allServiceCategory");
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

//Refresh Select Service Category
async function fillServiceCategory() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllServiceCategory', options);
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

document.getElementById("addServiceCategoryToDatabase").onclick = function (){refreshServiceCategory()};
async function refreshServiceCategory(){
    const dataStream = await fillServiceCategory();
    var selectBox = document.getElementById("allServiceCategory");
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

    var toggle = document.getElementById("serviceCategoryHidden");
    if(toggle.style.display == "none") toggle.style.display = "block";
    else toggle.style.display = "none";
}

//Add Service Category
document.getElementById("addServiceCategory").onclick = function() {addServiceType()};
async function addServiceType() {  refreshMainServiceCategory() }

document.getElementById("serviceCategoryClick").onclick = function() {addServiceTypeToDatabase()};
async function addServiceTypeToDatabase() {
        var name = document.getElementById("serviceCategory").value;
        var isDeleted = false;

        if(name == '') {
            alert('Service Category empty')
            return;
        }

    if(serviceCategoryState.state == 'add'){
        var data = {name, isDeleted};

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
    
        const response = await fetch('/addServiceCategory', options);
        const dataStream = await response.json();
        if(await dataStream.message == 'duplicate'){
            return alert('This Service Category already exists');
        }

    }
    else if(serviceCategoryState.state == 'edit'){
        var oldName = serviceCategoryState.toEdit;
        var data = {name, oldName, isDeleted};

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data, serviceCategoryState.toEdit)
            };

        const response = await fetch('/editServiceCategory', options);
        const dataStream = await response.json();
        if(await dataStream.message == 'duplicate'){
            return alert('This Service Category already exists');
        }
        addServiceType();
    }

    document.getElementById("serviceCategory").value = ""; 

    refreshServiceCategory();
    refreshMainServiceCategory(); 
}

//Edit Service Category
document.getElementById("editServiceCategory").onclick = function() {editServiceType()};
async function editServiceType() {
    var name = document.getElementById("allServiceCategory").value;
    if(name == '') alert('Please select a Service Category')
    else {
        serviceCategoryState.state = 'edit';
        serviceCategoryState.toEdit = name;
        document.getElementById("serviceCategory").style.color = 'blue'
        document.getElementById("addServiceCategory").style.display = 'block'
        document.getElementById("editServiceCategory").style.display = 'none'
        document.getElementById("deleteServiceCategory").style.display = 'block'
        
        document.getElementById("serviceCategory").value = name;
    }
}

//delete Service Category
document.getElementById("deleteServiceCategory").onclick = function() {deleteServiceType()};
async function deleteServiceType() {
    var name = document.getElementById("allServiceCategory").value;
    if(name == '') return alert('Please select a Service Category')
    if (!confirm(`Are you sure to delete the Service Category ${name}?`)) return 

    var data = {name};
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/deleteServiceCategory', options);
    const dataStream = await response.json();

    addServiceType();
    refreshServiceCategory();
    refreshMainServiceCategory(); 
}
