var currentUser = {username:null, userType:null};

window.onload = async function(){
    getUserDetails();

    insertServiceCat();

    await insertServices();

    getHrs();
}

function getHrs(){
    const hrs = ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
    var selectBox = document.getElementById("selectBookingTime");

    hrs.forEach(time => {
        var option = document.createElement("option");
        option.text = time;
        option.value = time;
        selectBox.add(option);
});
}

function getUserDetails(){
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
} 

function clearServices() {
    var mainDiv = document.getElementById("insertServices");
    mainDiv.innerHTML = '';
}

async function insertServiceCat(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };
    
    const response = await fetch('/searchAllServiceCategory', options);
    const dataStream = await response.json();
    
    var mainDiv = document.getElementById("insertServices");
    var serviceCatList = '';
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                serviceCatList += `
                    <div id="${value}" class="category">
                        <h1>${value}</h1>
                    </div>
                `
            }
        });
    });

    mainDiv.innerHTML = serviceCatList;
}
async function getServicesFromCategory(value){
    var data = {value}
    const orderOptions =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
    };
    
    const response = await fetch('/sortServiceByCategory', orderOptions);
    const dataStream = await response.json();

    return dataStream;
}

async function insertServices(){
    var serviceName = '';
    var servicePrice = '';
    var serviceId = '';
    var serviceList = '';

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllServiceCategory', options);
    const dataStream = await response.json();
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'name') {
                
                var orderDataStream = await getServicesFromCategory(value);

                orderDataStream.forEach(objs => {
                    Object.entries(objs).forEach(([keys, values]) => {
                        if(keys == 'id') serviceId = values;
                        if(keys == 'name') {
                            serviceName = values;
                        }
                        if(keys == 'price') {
                            servicePrice = values;
                        }
                    });
                    
                    serviceList += `
                    <div class='box' id="${serviceId}">
                        ${serviceName}
                        ₱${servicePrice}
                    </div>
                    `;
                });

                document.getElementById(`${value}`).innerHTML += serviceList;
                serviceList = '';
            }

            var divs = document.getElementsByClassName("box");
            for (let div of divs) {
                div.addEventListener("click", divPressed);
            }
        });
    });
}

const divPressed = async (e) => {
    console.log(e.target.id)
    await callServiceDetails(e.target.id)
} 

async function callServiceDetails(id){
    var data = { id };

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/searchAServiceById', options);
    const dataStream = await response.json();
    
    console.log(dataStream);
    document.getElementById("orderName").value = dataStream.name;
    document.getElementById("servicePrice").value = dataStream.price;
    document.getElementById("serviceDescription").value = dataStream.description;
    document.getElementById("serviceCategory").value = dataStream.categories.name;
}

function bookNowClick(){
    document.getElementById("bookNow").style.display = "none";
    document.getElementById("hideBookNow").style.display = "block";
}

function cancelBooking(){
    document.getElementById("bookNow").style.display = "block";
    document.getElementById("hideBookNow").style.display = "none";
}

async function confirmBooking(){
    var name = document.getElementById("orderName").value;
    if(name == '') {
        alert('Kindly select a service');
        return
    }

    var data = { name };
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/searchAService', options);
    const dataStream = await response.json();

    

}