var currentUser = {username:null, userType:null};

function editProfileClick(){
    document.getElementById('firstname').disabled = false;
    document.getElementById('familyname').disabled = false;
    document.getElementById('birthday').disabled = false;
    document.getElementById('phone').disabled = false;
    document.getElementById('address').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('usernameProfile').disabled = false;
    document.getElementById('password').disabled = false;
}

function cancelProfileClick() {
    document.getElementById('firstname').disabled = true;
    document.getElementById('familyname').disabled = true;
    document.getElementById('birthday').disabled = true;
    document.getElementById('phone').disabled = true;
    document.getElementById('address').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('usernameProfile').disabled = true;
    document.getElementById('password').disabled = true;
}

window.onload = async function(){
    getUserDetails();

    //refresh cart
    getUserCart();

    //refresh bookings
    getUserBookings()

    //refresh customer info
    getCustomerInfo();
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
} 

//---------------------------------- CART
var orders = {};
async function getUserCart(){
    const username = currentUser.username;

    data = {username};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/getUserCarts', options);
    const dataStream = await response.json();
    console.log(dataStream)

    if(dataStream.length === 0) return
    orders = dataStream;

    fillOrderNumSelect(dataStream);
}

function fillOrderNumSelect(data){
    var orderNumArray = [];
    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'carts') {
                if(!orderNumArray.includes(value.orderNumber)) orderNumArray.push(value.orderNumber)
            }
        });
    });

    const selectBox = document.getElementById("orderNumber");
    orderNumArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });

    selectBox.value = '';
    //onChangeOrderNumSelect()
}

async function onChangeOrderNumSelect(){
    const orderValue = document.getElementById("orderNumber").value;
    const textBox = document.getElementById("orderDetails");
    const otherDetails = document.getElementById("orderStatus");

    textBox.value = '';
    var cartProductName = '';
    var status = 0;
    var cartProductPrice = 0;
    var quantities = 0;
    var cartTotal = 0;
    var currOrder = 0;

    orders.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if (key === 'boughtquantity') quantities = value;
            if(key === 'products'){
                cartProductName = value.name;
                cartProductPrice = value.price;
            }
            if(key == 'carts') {
                if(orderValue == value.orderNumber) {
                    textBox.value += `${cartProductName}\n ${cartProductPrice} | ${quantities}x\n\n`;                    
                    currOrder += parseInt(quantities)*parseInt(cartProductPrice);
                    status = value.deliveryStatusId;
                }
            }
        });

        cartTotal += (parseInt(quantities)*parseInt(cartProductPrice));
    });
    
    var data = {status}

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/getDeliveryStatus', options);
    const dataStream = await response.json();

    otherDetails.innerHTML = `Order Total: ₱${currOrder} <br> Total Purchase Cost: ₱${cartTotal} <br><br> Status: ${dataStream}`;
}

//--------------------- Bookings
var bookings = {}
async function getUserBookings(){
    const username = currentUser.username;

    data = {username};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/getUserBooking', options);
    const dataStream = await response.json();

    if(dataStream.length === 0) return
    bookings = dataStream;
    
    console.log(bookings);
    fillBookDateSelect(dataStream);
}

function fillBookDateSelect(data){
    var orderDateArray = [];
    var bookedId = 0;
    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId') bookedId = value;
            if(key == 'books') {
                var dateSplit = value.bookDate.split("T");
                var dateTime = `${bookedId} | ${dateSplit[0]} ${value.bookStartTime}`
                if(!orderDateArray.includes(dateTime)) orderDateArray.push(dateTime)
            }
        });
    });

    const selectBox = document.getElementById("bookDate");
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
    const bookValue = document.getElementById("bookDate").value;
    const textBox = document.getElementById("bookDetails");
    const otherDetails = document.getElementById("appointmentStatus");

    var dateSplit = bookValue.split(" | ");
    textBox.value = '';
    var status = 0;
    var currBookId = '';
    var needBookId = parseInt(dateSplit[0]);

    bookings.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'bookId'){
                currBookId = value;
            }
            if(key === 'books') status = value.bookStatusId;
            if(key == 'services') {
                if(needBookId == currBookId) textBox.value += `${value.name}\n`;
            }
        });
    });
    
    var data = {status}

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/getBookStatus', options);
    const dataStream = await response.json();

    otherDetails.innerHTML = `Status: ${dataStream}`;
}

//-------------- Customer Information
var customer = {}
var isChangePassword = false;

async function getCustomerInfo() {
    const username = currentUser.username;

    data = {username};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/userLogin', options);
    const dataStream = await response.json();
    customer = dataStream.user[0];
    
    console.log(dataStream)
    await fillCustomer(dataStream);
}

function fillCustomer(){
    var dateSplit = customer.birthday.split("T");

    document.getElementById("firstname").value = customer.firstName;
    document.getElementById("familyname").value = customer.lastName;
    document.getElementById("birthday").value = dateSplit[0];
    document.getElementById("phone").value = customer.phone;
    document.getElementById("address").value = customer.address;
    document.getElementById("email").value = customer.email;
    document.getElementById("usernameProfile").value = customer.username;    
}

async function saveProfileClick() { 
    var oldUsername = customer.username
    if(isChangePassword){
        var password = document.getElementById("password").value;
        var newPassword = document.getElementById("newPassword").value;

        var data = {password, newPassword, oldUsername};
        
        var missingFields = await missingData(data);
        if(missingFields != '') {
            alert(`Empty Fields! \n There are empty fields in this category/ies: \n${missingFields}`);
            return;
        }
        if(password === newPassword){
            alert(`Password Match! \n old password is equal to new password`);
            return;
        }

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
        };
        
        const response = await fetch('/passwordChange', options);
        const dataStream = await response.json();
    }
    else {
        var firstName = document.getElementById("firstname").value;
        var lastName = document.getElementById("familyname").value;
        var birthday = document.getElementById("birthday").value;
        var phone = document.getElementById("phone").value;
        var address = document.getElementById("address").value;
        var email = document.getElementById("email").value;
        var username = document.getElementById("username").value;
        
        var data = {firstName, lastName, birthday, phone, address, email, username, oldUsername};

        var missingFields = await missingData(data);
        if(missingFields != '') {
            alert(`Empty Fields! \n There are empty fields in this category/ies: \n${missingFields}`);
            return;
        }

        var wrongFormatFields = wrongFormat(data);
        if(wrongFormatFields != ''){
            alert(`Wrong Format! \n There are wrong fields in this category/ies: \n${missingFields}`);
            return;
        }

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
        };
        
        const response = await fetch('/editCustomer', options);
        const dataStream = await response.json();

        if(dataStream) {
            alert(`Username Taken! \n This username is already taken.`);
            return;
        }
    }


}

function editProfileClick(){
    enableCustomers();
    document.getElementById("buttonSaveCancel").style.display = "block";
    document.getElementById("editProfile").style.display = "none";
    isChangePassword = false;
}

function cancelProfileClick(){
    disableCustomers();
    document.getElementById("buttonSaveCancel").style.display = "none";
    document.getElementById("editProfile").style.display = "block";
    document.getElementById("changePasswordButtonDiv").style.display = "block";
    document.getElementById("changePasswordDiv").style.display = "none";
    isChangePassword = false;
}

function changePassword(){
    document.getElementById("changePasswordButtonDiv").style.display = "none";
    document.getElementById("changePasswordDiv").style.display = "block";
    document.getElementById("buttonSaveCancel").style.display = "block";
    document.getElementById("editProfile").style.display = "none";
    isChangePassword = true;
}

function enableCustomers(){
    document.getElementById("firstname").disabled = false;
    document.getElementById("familyname").disabled = false;
    document.getElementById("birthday").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("address").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("usernameProfile").disabled = false;    
}

function disableCustomers(){
    document.getElementById("firstname").disabled = true;
    document.getElementById("familyname").disabled = true;
    document.getElementById("birthday").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("address").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("usernameProfile").disabled = true;
    
    document.getElementById("changePasswordDiv").style.display = "none";
    fillCustomer();
    document.getElementById("password").value = '';
    document.getElementById("newPassword").value = '';
}

async function missingData(data){
    var missingVariable = '';
    Object.entries(data).forEach(([key, value]) => {
            if (key != 'isDeleted' && value == '') {
                console.log(key);
                missingVariable += `- ${key}`
            }
    });

    return missingVariable;
}

function wrongFormat(data){
    var wrongFormatReturn = ''
    if(!validatePhoneNumber(data.phone)) {
       wrongFormatReturn += '- Phone\n'
    }
    if(!validateEmail(data.email)) {
        wrongFormatReturn += '- Email'
    }

    return wrongFormatReturn;
}

function validatePhoneNumber(number) {
    const regex = /^(09|\+639)\d{9}$/; // regular expression for Philippine mobile numbers
    return regex.test(number);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regular expression for email validation
    return regex.test(email);
}

function validatePassword(password, coPassword){
if(password === coPassword) return true;

return false;
}

async function bookCancel(){
    alert('This appointment has been canceled');
}

async function orderCancel(){
    alert('This order has been canceled');
}
