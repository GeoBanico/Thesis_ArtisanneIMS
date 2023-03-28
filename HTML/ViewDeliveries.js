var currentUser = {username:null, userType:null};

window.onload = async function(){
    getUserDetails();

    fillDeliveryStatus();

    await getAllOrders();

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
            changeDisplay[i].style.display = 'none'
        }
    }
}

function fillDeliveryStatus(){
    const status = ['Order Placed', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered', 'Canceled'];
    
    status.forEach(stats => {
        var option = document.createElement("option");
        option.text = stats;
        option.value = stats;
        document.getElementById("orderStatus").add(option);
    });
    
}

var allOrders = {};
async function getAllOrders(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/getAllOrders', options);
    const dataStream = await response.json();
    allOrders = dataStream;
    
    console.log(allOrders);
    fillOrderNumberSelect();
}

function fillOrderNumberSelect(){
    emptyFields()
    var orderNumberArray = [];
    var cartId = 0;
    allOrders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'cartId') cartId = value;
            if(key == 'carts') {
                var dataToInsert = `${cartId} | ${value.orderNumber}`
                if(!orderNumberArray.includes(dataToInsert)) orderNumberArray.push(dataToInsert)
            }
        });
    });

    const selectBox = document.getElementById("deliveriesList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    orderNumberArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });
    selectBox.selectedIndex = "0";

    onChangeOrderNumSelect()
}

async function onChangeOrderNumSelect(){
    const orderNumber = document.getElementById("deliveriesList").value;
    const textBox = document.getElementById("customerOrder");

    textBox.value = '';
    var needCartId = orderNumber.split(" | ");
    var currCartId = 0;
    var customerName = '';
    var customerLoc = '';
    var quantity = '';
    var deliveryStatus = '';

    allOrders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'boughtquantity') quantity = value;
            if(key == 'cartId') currCartId = value;
            if(key == 'carts'){
                customerName = `${value.customers.firstName} ${value.customers.lastName}`;
                customerLoc = value.customers.address;
                deliveryStatus = value.deliveryStatuses.type;
            }
            if(key == 'products') {
                if(needCartId[0] == currCartId){
                    textBox.value += `${quantity}x | ${value.name}\n`
                }
            }
        });
    });

    document.getElementById("customerName").value = customerName;
    document.getElementById("customerLocation").value = customerLoc;
    document.getElementById("orderStatus").value = deliveryStatus;
}

function fillSelects(){
    var dates = [];
    var statuses = []
    allOrders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key === 'carts') {
                var dateSplit = value.dateOrdered.split("T");
                if(!dates.includes(dateSplit[0])) dates.push(dateSplit[0])

                var bookStats = value.deliveryStatuses.type;
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
    document.getElementById("deliveriesList").value = '';
    document.getElementById("customerName").value = '';
    document.getElementById("customerOrder").value = '';
    document.getElementById("customerLocation").value = '';
    document.getElementById("orderStatus").value = '';
}

function searchByDateClick(){
    emptyFields()
    var selectBox = document.getElementById("deliveriesList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    var selectedDate = document.getElementById("searchByDate").value;

    allOrders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key === 'carts') {
                var dateSplit = value.dateOrdered.split("T");
                if(selectedDate == dateSplit[0]){
                    var option = document.createElement("option");
                    option.text = value.orderNumber;
                    option.value = value.orderNumber;
                    selectBox.add(option);
                }
            }
        });
    });
    if(selectBox.length > 0) onChangeOrderNumSelect()
}

function searchByStatusClick(){
    emptyFields()
    const selectBox = document.getElementById("deliveriesList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    var selectedStats = document.getElementById("searchByStatus").value;
    
    var orderNumArray = [];
    var cartsId = 0;

    allOrders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'cartId') cartsId = value;
            if(key == 'carts') {
                if(selectedStats == value.deliveryStatuses.type){
                    var dataToInput = `${cartsId} | ${value.orderNumber}`
                    if(!orderNumArray.includes(dataToInput)) orderNumArray.push(dataToInput)
                }
            }
        });
    });

    orderNumArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });
    selectBox.selectedIndex = "0";

    if(selectBox.length > 0) onChangeOrderNumSelect()
}

async function enableChangeStatus(){
    var status = document.getElementById("orderStatus").value;
    var idSplit = document.getElementById("deliveriesList").value.split(" | ")
    var cartId = idSplit[0];

    data = {status, cartId};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/changeOrderStatus', options);
    const dataStream = await response.json();

    if(dataStream != '') {
        alert(dataStream);
        return
    }

    await getAllOrders();
    fillSelects();
}