var currentUser = {username:null, userType:null};

window.onload = async function(){

    getUserDetails();

    fillProducts()

    fillServices()

    await getAllReceipts()

    await fillTableReceiptsByAll()
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

var allServices = {}
async function fillServices(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllService', options);
    const dataStream = await response.json();
    allServices = dataStream;
    
    fillServicesSelect(dataStream)
}

async function fillServicesSelect(data){
    const selectedDate = document.getElementById("serviceList");
    while(selectedDate.length > 0){ selectedDate.remove(0); }

    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectedDate.add(option);
            }
        });
    });
}

function findPrice(data, nameLock){
    var currName = '';
    var price = 0;
    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                currName = value;
            }
            if(key == 'price'){
                if(currName == nameLock) {
                    price = value;
                }
            }
        });
    });

    return price;
}

function addService(){
    const allServiceList = document.getElementById("allServiceList");
    const serviceName = document.getElementById("serviceList").value;
    const servicePrice = findPrice(allServices, serviceName);

    var option = document.createElement("option");
    option.text = `${servicePrice} | ${serviceName}`;
    option.value = `${servicePrice} | ${serviceName}`;
    allServiceList.add(option);
}

var allProducts = {}
async function fillProducts(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllProduct', options);
    const dataStream = await response.json();
    allProducts = dataStream;
    
    fillProductSelect(dataStream)
}

async function fillProductSelect(data){
    const selectedDate = document.getElementById("productList");
    while(selectedDate.length > 0){ selectedDate.remove(0); }

    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectedDate.add(option);
            }
        });
    });
}

function addProduct() {
    const allProductList = document.getElementById("allProductList");
    const productName = document.getElementById("productList").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productPrice = findPrice(allProducts, productName);

    if(productQuantity == '') return alert('Please Select Quantity');

    var option = document.createElement("option");
    option.text = `${productQuantity}x ${productPrice} | ${productName}`;
    option.value = `${productQuantity}x ${productPrice} | ${productName}`;
    allProductList.add(option);
    findCurrTotal(productPrice, productQuantity);

    document.getElementById("hiddenProductList").style.display = "block";
}

function removeProduct(){
    var productList = document.getElementById("allProductList")
    var selectedProduct = document.getElementById("allProductList").value;
    var productName = document.getElementById("productList").value;

    if(selectedProduct == '') {
        alert('Kindly select one of your ordered products');
        return
    }

    if(confirm(`Do you want to remove this product: ${productName}?`) == false) return

    for (let i = 0; i < productList.length; i++) {
        if(productList.options[i].value == selectedProduct) productList.remove(i);
    }

    if(productList.length == 0) {
        document.getElementById("hiddenProductList").style.display = "none";
    }
}

function addService(){
    const allServiceList = document.getElementById("allServiceList");
    const serviceName = document.getElementById("serviceList").value;
    const servicePrice = findPrice(allServices, serviceName);

    var option = document.createElement("option");
    option.text = `${servicePrice} | ${serviceName}`;
    option.value = `${servicePrice} | ${serviceName}`;
    allServiceList.add(option);
    findCurrTotal(servicePrice, 1); 

    document.getElementById("hiddenServiceList").style.display = "block";
}

function removeService(){
    var serviceList = document.getElementById("allServiceList")
    var selectedService = document.getElementById("allServiceList").value;
    var serviceName = document.getElementById("serviceList").value

    if(selectedService == '') {
        alert('Kindly select one of your ordered services');
        return
    }

    if(confirm(`Do you want to remove this service: ${serviceName}?`) == false) return

    for (let i = 0; i < serviceList.length; i++) {
        if(serviceList.options[i].value == selectedService) serviceList.remove(i);
    }

    if(serviceList.length == 0) {
        document.getElementById("hiddenServiceList").style.display = "none";
    }
}

function findCurrTotal(price, quantity){
    var curTotal = document.getElementById('currentTotal').innerHTML;

    var total = 0
    if(curTotal != '') total = parseInt(curTotal) + (parseInt(price) * parseInt(quantity));
    else total = (parseInt(price) * parseInt(quantity));

    document.getElementById('currentTotal').innerHTML = total;

    if(document.getElementById('discountGiven').value != '') return getDiscounts();
    document.getElementById('totalOrder').innerHTML = total;
}

function getDiscounts(){
    var discounted = document.getElementById('discountGiven').value;
    var curTotal = document.getElementById('currentTotal').innerHTML;

    if(curTotal == '') return
    if(discounted.includes('-')) return alert('Negative Discount: \n Discounts should not be negative');
    if(discounted == '.' || discounted == '') document.getElementById('totalOrder').innerHTML = curTotal;

    var total = (parseInt(curTotal) - parseInt(discounted));
    if(total < 0) {
        total = parseInt(curTotal);
        document.getElementById('discountGiven').value = '';
    } 

    document.getElementById('totalOrder').innerHTML = total;
}

function futureDate(){
    var dateReceipt = document.getElementById("receiptDate").value;
    var getDate = new Date();
    var currDate = `${getDate.getFullYear()}-${getDate.getMonth()+1}-${getDate.getDate()}`

    return (new Date(currDate).getTime()) < (new Date(dateReceipt).getTime())
}

async function saveReceipt(){
    var dateReceipt = document.getElementById("receiptDate").value;
    var serviceLength = document.getElementById("allServiceList");
    var productLength = document.getElementById("allProductList");
    var costTotal = parseInt(document.getElementById("totalOrder").innerHTML);
    var discount = parseInt(document.getElementById("discountGiven").value);

    //CHANGE -> Discount when empty
    if(discount == '') discount = 0;

    //SET -> Receipt Number
    var getDate = new Date();
    var receiptNumber = `${dateReceipt}_${getDate.getHours()}${getDate.getMinutes()}${getDate.getSeconds()}${getDate.getMilliseconds()}`

    //RESTRICTIONS -> No Date, Future Date, Empty Service & Product
    if(dateReceipt == '') return alert('Missing Date: \n Kindly fill up the date');
    if(futureDate()) return alert('Future Date Detected: \n You are placing a receipt in a future date');
    if(serviceLength.length == 0 && productLength.length == 0) return alert('Empty Fields: \n Kindly enter a product or service');

    //SETTING UP -> Setting All needed information
    var data = {}
    var serviceListToAdd = []
    var productListToAdd = []
    if(serviceLength.length > 0){
        for (let i = 0; i < serviceLength.length; i++) {
            var serv = serviceLength.options[i].value.split(" | ");
            serviceListToAdd.push(serv[1]);
        }
    }

    if(productLength.length > 0){
        var productData = {}
        for (let i = 0; i < productLength.length; i++) {
            var prod = productLength.options[i].value.split(" | ");
            var prodQuan = prod[0].split("x ");
            const productName = prod[1];
            const productQuantity = prodQuan[0];
            productData = {productName , productQuantity}

            productListToAdd.push(productData);
        }
    }

    data =  {dateReceipt, serviceListToAdd, productListToAdd, costTotal, receiptNumber, discount}

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/insertReceipt', options);
    const dataStream = await response.json()

    console.log(dataStream);
    if(dataStream != '') return alert(`Product Quantity Reached: This are the remaining quantity of the ordered Product \n${dataStream}`)

    alert('Receipt Saved');
}

//GET RECEIPTS

async function getAllReceipts(){
    await getAllServiceReceipts();
    await getAllProductReceipts();

    fillDate();
    fillMonth();
    fillYear();
}
var getServiceList = {}
async function getAllServiceReceipts(){
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    }

    const response = await fetch('/getAllServiceReceipts', options);
    const dataStream = await response.json()
    getServiceList = dataStream;
    console.log(getServiceList);
}

var getProductList = {}
async function getAllProductReceipts(){
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    }

    const response = await fetch('/getAllProductReceipts', options);
    const dataStream = await response.json()
    getProductList = dataStream;
    console.log(getProductList);
}

//FILL RECEIPTS
async function fillTableReceiptsByAll(){
    //SERVICE
    var currDate = '';
    var servicesStore = '';
    var servicePriceStore = '';

    var table = document.getElementById("servicesTable");
    getServiceList.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                currDate = dateSplit[0];
            }
            if(key == 'services') {
                servicesStore = `${value.name}\n`;
                servicePriceStore = `${value.price}\n`
            }
        });

        let row = table.insertRow();
        let date = row.insertCell(0);
        date.innerHTML = currDate;
        let name = row.insertCell(1);
        name.innerHTML = servicesStore;
        let price = row.insertCell(2);
        price.innerHTML = servicePriceStore;
    });
    
    //PRODUCT
    currDate = '';
    var productQuantity = '';
    var productsStore = '';
    var productPriceStore = '';
    var tableProd = document.getElementById("productTable");
    getProductList.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'boughtQuantity') {
                productQuantity = `${value}`
            } 
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                currDate = dateSplit[0];
            }
            if(key == 'products') {
                productsStore = `${value.name}`;
                productPriceStore = `${value.price}`
            }
            prevDate = currDate;
        });
        
        let row = tableProd.insertRow();
        let date = row.insertCell(0);
        date.innerHTML = currDate;
        let name = row.insertCell(1);
        name.innerHTML = productsStore;
        let price = row.insertCell(2);
        price.innerHTML = productPriceStore;
        let quan = row.insertCell(3);
        quan.innerHTML = productPriceStore;
    });
}

function fillDate(){
    var allDate = [];

    getServiceList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                if(!allDate.includes(dateSplit[0])) allDate.push(dateSplit[0]);
            }
        });
    });

    getProductList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                if(!allDate.includes(dateSplit[0])) allDate.push(dateSplit[0]);
            }
        });
    });

    var selectDate = document.getElementById("searchByDate");
    while(selectDate.options.length > 0){ selectDate.remove(0); }
    for (let i = 0; i < allDate.length; i++) {
        var option = document.createElement("option");
        option.text = allDate[i];
        option.value = allDate[i];
        selectDate.add(option);
    }
    selectDate.value='';
}

function fillMonth(){
    var allMonths = [];

    getServiceList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                var setDate = `${(new Date(dateSplit[0])).getMonth()}-${(new Date(dateSplit[0])).getFullYear()}`
                if(!allMonths.includes(setDate)) allMonths.push(setDate);
            }
        });
    });

    getProductList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                var setDate = `${(new Date(dateSplit[0])).getMonth()}-${(new Date(dateSplit[0])).getFullYear()}`
                if(!allMonths.includes(setDate)) allMonths.push(setDate);
            }
        });
    });

    var selectDate = document.getElementById("searchByMonth");
    while(selectDate.options.length > 0){ selectDate.remove(0); }
    for (let i = 0; i < allMonths.length; i++) {
        var option = document.createElement("option");
        option.text = allMonths[i];
        option.value = allMonths[i];
        selectDate.add(option);
    }
    selectDate.value='';
}

function fillYear(){
    var allYear = [];

    getServiceList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                var setDate = (new Date(dateSplit[0])).getFullYear()
                if(!allYear.includes(setDate)) allYear.push(setDate);
            }
        });
    });

    getProductList.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'receipts') {
                var dateSplit = value.date.split("T");
                var setDate = (new Date(dateSplit[0])).getFullYear()
                if(!allYear.includes(setDate)) allYear.push(setDate);
            }
        });
    });

    var selectDate = document.getElementById("searchByYear");
    while(selectDate.options.length > 0){ selectDate.remove(0); }
    for (let i = 0; i < allYear.length; i++) {
        var option = document.createElement("option");
        option.text = allYear[i];
        option.value = allYear[i];
        selectDate.add(option);
    }
    selectDate.value='';
}