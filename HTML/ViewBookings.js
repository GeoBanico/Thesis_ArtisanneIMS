var currentUser = {username:null, userType:null};

window.onload = async function(){
    getUserDetails();

    fillBookStatus();

    await getAllBookings();

    fillSelects();
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

    if(currentUser.userType == 'Manager' || currentUser.userType == 'Owner' ) {
        const changeDisplay = document.getElementsByClassName('forOwnerManager');
        for (let i = 0; i < changeDisplay.length; i++) {
            changeDisplay[i].style.display = 'block'
        }
    }
}

function fillBookStatus(){
    const status = ['Confirmed', 'Due', 'Cancelled'];
    
    status.forEach(stats => {
        var option = document.createElement("option");
        option.text = stats;
        option.value = stats;
        document.getElementById("bookStatus").add(option);
    });
    
}

var allBookings = {};
async function getAllBookings(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/getAllBookings', options);
    const dataStream = await response.json();
    allBookings = dataStream;
    
    console.log(allBookings);
    fillBookDateSelect();
}

function fillBookDateSelect(){
    emptyFields()
    var orderDateArray = [];
    var bookedId = 0;
    allBookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId') bookedId = value;
            if(key == 'books') {
                var dateSplit = value.bookDate.split("T");
                var dateTime = `${bookedId} | ${dateSplit[0]} ${value.bookStartTime}`
                if(!orderDateArray.includes(dateTime)) orderDateArray.push(dateTime)
            }
        });
    });

    const selectBox = document.getElementById("bookingList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    orderDateArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });
    
    selectBox.selectedIndex = "0";

    onChangeBookDateSelect()
}

async function onChangeBookDateSelect(){
    const bookValue = document.getElementById("bookingList").value;
    const textBox = document.getElementById("customerOrder");

    var customerName = '';
    var dateSplit = bookValue.split(" | ");
    textBox.value = '';
    var currBookId = '';
    var bookStats = '';
    var needBookId = parseInt(dateSplit[0]);

    allBookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId'){
                currBookId = value;
            }
            if(key === 'books') {
                if(needBookId == currBookId) {
                    bookStats = value.bookStatuses.type;
                    customerName = `${value.customers.firstName} ${value.customers.lastName}`
                }
            }
            if(key == 'services') {
                if(needBookId == currBookId) textBox.value += `${value.name}\n`;
            }
        });
    });

    document.getElementById("customerName").innerHTML = customerName;
    document.getElementById("currBookStatus").innerHTML = bookStats;
}

function fillSelects(){
    var dates = [];
    var statuses = []
    allBookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key === 'books') {
                var dateSplit = value.bookDate.split("T");
                if(!dates.includes(dateSplit[0])) dates.push(dateSplit[0])

                var bookStats = value.bookStatuses.type;
                if(!statuses.includes(bookStats)) statuses.push(bookStats);
            }
        });
    });

    dates.sort();
    const selectedDate = document.getElementById("searchByDate");
    while(selectedDate.length > 0){ selectedDate.remove(0); }
    dates.forEach(d => {
        var option = document.createElement("option");
        option.text = d;
        option.value = d;
        selectedDate.add(option);
    });
    selectedDate.selectedIndex = "0";

    const selectedStats = document.getElementById("searchByStatus");
    while(selectedStats.length > 0){ selectedStats.remove(0); }
    statuses.forEach(s => {
        var option = document.createElement("option");
        option.text = s;
        option.value = s;
        selectedStats.add(option);
    });
    selectedStats.selectedIndex = "0";
}

function emptyFields() {
    document.getElementById("bookingList").selectedIndex = 0;
    document.getElementById("customerName").innerHTML = '';
    document.getElementById("customerOrder").value = '';
    document.getElementById("currBookStatus").innerHTML = '';
    document.getElementById("bookStatus").selectedIndex = 0;
}

function searchByDateClick(){
    emptyFields()
    var selectBox = document.getElementById("bookingList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    var selectedDate = document.getElementById("searchByDate").value;
    
    var bookedId = 0;

    allBookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId') bookedId = value;
            if(key === 'books') {
                var dateSplit = value.bookDate.split("T");
                if(selectedDate == dateSplit[0]){
                    var dateTime = `${bookedId} | ${dateSplit[0]} ${value.bookStartTime}`
                    var option = document.createElement("option");
                    option.text = dateTime;
                    option.value = dateTime;
                    selectBox.add(option);
                }
            }
        });
    });
    if(selectBox.length > 0) onChangeBookDateSelect()
}

function searchByStatusClick(){
    emptyFields()
    const selectBox = document.getElementById("bookingList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    var selectedStats = document.getElementById("searchByStatus").value;
    
    var orderDateArray = [];
    var bookedId = 0;
    allBookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId') bookedId = value;
            if(key == 'books') {
                if(selectedStats == value.bookStatuses.type){
                    var dateSplit = value.bookDate.split("T");
                    var dateTime = `${bookedId} | ${dateSplit[0]} ${value.bookStartTime}`
                    if(!orderDateArray.includes(dateTime)) orderDateArray.push(dateTime)
                }
            }
        });
    });

    orderDateArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });
    selectBox.selectedIndex = "0";

    if(selectBox.length > 0) onChangeBookDateSelect()
}

async function enableChangeStatus(){
    var status = document.getElementById("bookStatus").value;
    var dateSplit = document.getElementById("bookingList").value.split(" | ")
    var bookProductId = dateSplit[0];

    if(status == '') return alert(`Empty Status!\nSelect a status`)
    var currentStatus = document.getElementById("currBookStatus").innerHTML;
    if(currentStatus == 'Due' || currentStatus == 'Cancelled') return alert(`The status of this appointment (${currentStatus}) could not be changed!`)

    if(!confirm('Are you sure you want to change the status of this appointment?')) return

    data = {status, bookProductId};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/changeBookStatus', options);
    const dataStream = await response.json();

    if(dataStream != '') {
        alert(dataStream);
        return
    }

    alert('Appointment Status change successful ... Refreshing Appointment List');

    await getAllBookings();
    fillSelects();
}