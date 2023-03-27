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
    console.log('start')
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
    
    if(currentUser.userType == 'Customer') document.getElementById('forEmployee').style.display = 'none';
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
                        <h2>${value}</h2>
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
    
    document.getElementById("orderName").value = dataStream.name;
    document.getElementById("servicePrice").value = dataStream.price;
    document.getElementById("serviceDescription").value = dataStream.description;
    document.getElementById("serviceCategory").value = dataStream.categories.name;
}

function bookNowClick(){
    var value = document.getElementById("orderName").value;
    var selectBox = document.getElementById("serviceList");

    if (value == '') {
        alert('Please select a service to book');
        return
    }
    if(theSameBookService(selectBox, value)) {
        alert('You already booked this service');
        return
    }

    document.getElementById("hideBookNow").style.display = "block";
    var option = document.createElement("option");
    option.text = value;
    option.value = value;
    selectBox.add(option);
}

function theSameBookService(selectBox, value){
    var hasTheSame = false;
    for (let i = 0; i < selectBox.length; i++) {
        if(selectBox[i].value == value) hasTheSame = true;
    }

    return hasTheSame;
}

function removeBooking(){
    var serviceList = document.getElementById("serviceList")
    var selectedService = document.getElementById("serviceList").value;

    if(selectedService == '') {
        alert('Kindly select one of your booked services');
        return
    }

    if(confirm(`Do you want to remove this product: ${selectedService}?`) == false) return

    for (let i = 0; i < serviceList.length; i++) {
        if(serviceList.options[i].value == selectedService) serviceList.remove(i);
    }

    if(document.getElementById("serviceList").length == 0) {
        document.getElementById("hideBookNow").style.display = "none";
    }
}

async function confirmBooking(){
    var serviceList = document.getElementById("serviceList");

    var bookDate = document.getElementById("selectBookingDate").value;
    var bookTime = document.getElementById("selectBookingTime").value;

    var hasErrors = checkMissingorError(bookDate);
    if(hasErrors != '') return alert(hasErrors)

    if(confirm(`Confirm Booking? \nNote: the services of this booking is not changeable`) == false) return

    var servicesBooked = [];
    
    for (let i = 0; i < serviceList.length; i++) {
       servicesBooked.push(serviceList.options[i].value);
    }

    var username = currentUser.username;
    var data = {username , servicesBooked, bookDate, bookTime};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/confirmBooking', options);
    const dataStream = await response.json();

    if(dataStream.message === 'duplicate') alert('You have already booked this day. \n Your booking schedule is our priority. \n\nThe business accepts on the counter services, so you may add additional services on your booked day.');
    else if (dataStream.message === 'max capacity'){alert('Maximum Bookings Reached: Could not set a reservation for this hour. \n Kindly choose another booking hour/day.');}
    else {
        alert('Appointment Successful! \n Redirecting to your profile page...')
        window.location.href = "./AccountDetails.html";
    }
}

function checkMissingorError(date){
    var dateNow = new Date();
    var bookedDate = new Date(date);

    if(date == '') return 'Booking Date is empty';
    if(bookedDate <= dateNow) return `Booking Error: \nKindly choose a date beyond the date of today (${getDateNow()})`

    return ''
}

function getDateNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Note: months are zero-indexed, so add 1
    const date = now.getDate();

    // Format the date as a string (e.g. "2023-03-23")
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    return dateString;
}
