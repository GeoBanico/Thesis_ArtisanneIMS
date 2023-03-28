var currentUser = {username:null, userType:null};

window.onload = async function(){
    getUserDetails();

    insertProductCat();

   await insertProducts();
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

    if(currentUser.userType == 'Customer') document.getElementById('forEmployee').style.display = 'none';
    if(currentUser.userType == 'Manager' || currentUser.userType == 'Owner' ) {
        const changeDisplay = document.getElementsByClassName('forOwnerManager');
        for (let i = 0; i < changeDisplay.length; i++) {
            changeDisplay[i].style.display = 'none'
        }
    }
} 

function clearProducts() {
    var mainDiv = document.getElementById("insertProducts");
    mainDiv.innerHTML = '';
}

async function getProductsFromCategory(value){
    var data = {value}
    const orderOptions =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
    };
    
    const response = await fetch('/sortProductByCategory', orderOptions);
    const dataStream = await response.json();

    return dataStream;
}

async function insertProductCat(){
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };
    
    const response = await fetch('/searchAllProductCategory', options);
    const dataStream = await response.json();
    
    var mainDiv = document.getElementById("insertProducts");
    var productCatList = '';
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                productCatList += `
                    <div id="${value}" class="category">
                        <h2>${value}</h2>
                    </div>
                `
            }
        });
    });

    mainDiv.innerHTML = productCatList;
}

async function insertProducts(){
    var productName = '';
    var productPrice = '';
    var productId = '';
    var productList = '';

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllProductCategory', options);
    const dataStream = await response.json();
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(async([key, value]) => {
            if(key == 'name') {
                
                var orderDataStream = await getProductsFromCategory(value);

                orderDataStream.forEach(objs => {
                    Object.entries(objs).forEach(([keys, values]) => {
                        if(keys == 'id') productId = values;
                        if(keys == 'name') {
                            productName = values;
                        }
                        if(keys == 'price') {
                            productPrice = values;
                        }
                    });
                    
                    productList += `
                    <div class='box' id="${productId}">
                        ${productName}
                        ₱${productPrice}
                    </div>
                    `;
                });

                document.getElementById(`${value}`).innerHTML += productList;
                productList = '';
            }

            var divs = document.getElementsByClassName("box");
            for (let div of divs) {
                div.addEventListener("click", divPressed);
            }
        });
    });
}

const divPressed = async (e) => {
    await callProductDetails(e.target.id)
} 

async function callProductDetails(id){
    var data = { id };

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };
    
    const response = await fetch('/searchAProductById', options);
    const dataStream = await response.json();

    document.getElementById("orderName").innerHTML = dataStream.name;
    document.getElementById("productPrice").innerHTML = dataStream.price;
    document.getElementById("productDescription").innerHTML = dataStream.description;
    document.getElementById("productCategory").innerHTML = dataStream.categories.name;
    document.getElementById("productQuantityLeft").innerHTML = dataStream.storeQuantity;
    document.getElementById("productQuantity").innerHTML = 1;
}

function subQuantity(){
    var quantity = document.getElementById("productQuantity").innerHTML;

    console.log(quantity);
    if(quantity == '') return
    if(parseInt(quantity) > 1) document.getElementById("productQuantity").innerHTML = parseInt(quantity)-1;
}

function addQuantity(){
    var quantity = document.getElementById("productQuantity").innerHTML;
    var quantityLeft = document.getElementById("productQuantityLeft").innerHTML;

    console.log(quantity);
    if(quantity == '') return
    if(parseInt(quantity) < parseInt(quantityLeft)) document.getElementById("productQuantity").innerHTML = parseInt(quantity)+1;
}

function theSameProduct(selectBox, value){
    var hasTheSame = false;
    for (let i = 0; i < selectBox.length; i++) {
        var splitArray = productList.options[i].innerHTML.split("x | ");
        if(splitArray[1] == value) hasTheSame = true;
    }

    return hasTheSame;
}

function addToCart(){
    var value = document.getElementById("orderName").innerHTML;
    var quantity = document.getElementById("productQuantity").innerHTML;
    var selectBox = document.getElementById("productList");
    var quantityLimit = parseInt(document.getElementById("productQuantityLeft").innerHTML);

    if (value == '') {
        alert('Please select a product to order');
        return
    }

    if(theSameProduct(selectBox, value)){
        for (let i = 0; i < selectBox.length; i++) {
            var splitArray = productList.options[i].innerHTML.split("x | ");
            if(splitArray[1] == value) {
                var totalQuantity = (parseInt(splitArray[0]) + parseInt(quantity));
                if(totalQuantity > quantityLimit) return alert(`Quantity Limit Reached: \n${totalQuantity}pcs of ${value} exceeds the current stock of the store`);
                productList.options[i].text = `${totalQuantity}x | ${value}`;
                productList.options[i].innerHTML = `${totalQuantity}x | ${value}`;;
            }
        }
        return
    }

    document.getElementById("hideOrderNow").style.display = "block";
    var option = document.createElement("option");
    option.text = `${quantity}x | ${value}`;
    option.innerHTML = `${quantity}x | ${value}`;
    selectBox.add(option);
}

function removeProduct(){
    var productList = document.getElementById("productList")
    var selectedProduct = document.getElementById("productList").value;

    if(selectedProduct == '') {
        alert('Kindly select one of your ordered products');
        return
    }

    if(confirm(`Do you want to remove this product: ${selectedProduct}?`) == false) return

    for (let i = 0; i < productList.length; i++) {
        if(productList.options[i].innerHTML == selectedProduct) productList.remove(i);
    }

    if(document.getElementById("productList").length == 0) {
        document.getElementById("hideOrderNow").style.display = "none";
    }
}

async function buyNow() {
    var productList = document.getElementById("productList");
    var date = new Date();
    var orderDate = getDateNow();
    var customerUsername = document.getElementById("username").innerHTML;
    var orderNumber = `${customerUsername}_${date.getDate()}${date.getMonth()}${date.getFullYear()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    var quantities = []
    var productOrdered = [];
    
    for (let i = 0; i < productList.length; i++) {
        var splitArray = productList.options[i].innerHTML.split("x | ");
        quantities.push(splitArray[0]);
        productOrdered.push(splitArray[1]);
    }
    
    var data = {customerUsername, productOrdered, orderDate, orderNumber, quantities};

    console.log(data);
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
    };

    const response = await fetch('/placeOrder', options);
    const dataStream = await response.json();

    if(!dataStream) return alert('This product already reached ')
    
    alert('Order Successful! \n Redirecting to your profile page...')
    window.location.href = "./AccountDetails.html";
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
