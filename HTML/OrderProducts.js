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
                        <h1>${value}</h1>
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
    console.log(e.target.id)
    await callProductDetails(e.target.id)
} 

// function saveToCookies(id){

//     //delete cookies
//     const cookies = document.cookie.split("; ");
//     for (const cookie of cookies) {
//         const [name, value] = cookie.split("=");
//         // Set the cookie's expiration date to a date in the past
//         if(name=='product') document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     }

//     // Calculate the expiration date of the cookies (7 days from now)
//     const expirationDate = new Date();
//     expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds

//     // Create the cookie strings
//     const productCookie = `product=${id};expires=${expirationDate.toUTCString()};path=/`;

//     // Save the cookies
//     document.cookie = productCookie;
// }

// function getProductDetails(){
//     const cookies = document.cookie.split("; ");
//     for (const cookie of cookies) {
//         const [name, value] = cookie.split("=");
//         if (name === "product") {
//             callProductDetails(decodeURIComponent(value))
//         }
//     }
// } 

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
    document.getElementById("productPrice").value = dataStream.price;
    document.getElementById("productDescription").value = dataStream.description;
    document.getElementById("productCategory").value = dataStream.categories.name;
}