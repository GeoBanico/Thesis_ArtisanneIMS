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
    if(currentUser.userType == 'Manager' || currentUser.userType == 'Owner' ) {
        const changeDisplay = document.getElementsByClassName('forOwnerManager');
        for (let i = 0; i < changeDisplay.length; i++) {
            changeDisplay[i].style.display = 'block'
        }
    }
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
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    orderNumArray.forEach(orderNum => {
        var option = document.createElement("option");
        option.text = orderNum;
        option.value = orderNum;
        selectBox.add(option);
    });

    onChangeOrderNumSelect()
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
                    textBox.value += `${cartProductName}\n ${quantities}x | ₱${cartProductPrice} \n\n`;                    
                    currOrder += parseInt(quantities)*parseInt(cartProductPrice);
                    status = value.deliveryStatuses.type;                    ;
                }
            }
        });

        cartTotal += (parseInt(quantities)*parseInt(cartProductPrice));
    });
    
    document.getElementById("cartTotal").innerHTML = `₱${currOrder}`;
    document.getElementById("allCartTotal").innerHTML = `₱${cartTotal}`;
    
    otherDetails.innerHTML = status;
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
            if(key === 'books') {
                if(needBookId == currBookId) status = value.bookStatuses.type;
            }
            if(key == 'services') {
                if(needBookId == currBookId) textBox.value += `${value.name}\n`;
            }
        });
    });

    otherDetails.innerHTML = status;
}

//-------------- Customer Information
var customer = {}
var isChangePassword = false;
var isChangeProfile = false;

async function getCustomerInfo() {
    const username = currentUser.username;

    data = {username};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/getOneUserDetails', options);
    const dataStream = await response.json();
    customer = dataStream;
    console.log(customer)
    fillCustomer(dataStream);
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
    var oldUsername = currentUser.username

    if(isChangeProfile) {
        var firstName = document.getElementById("firstname").value;
        var lastName = document.getElementById("familyname").value;
        var birthday = document.getElementById("birthday").value;
        var phone = document.getElementById("phone").value;
        var address = document.getElementById("address").value;
        var email = document.getElementById("email").value;
        var username = document.getElementById("usernameProfile").value;
        
        var data = {firstName, lastName, birthday, phone, address, email, username, oldUsername};

        var missingFields = await missingData(data);
        if(missingFields != '') return alert(`EMPTY FIELDS! \nThere are empty fields in this category/ies: \n${missingFields}`);
    
        if(calculateAge(birthday) < 12) return alert(`BELOW AGE OF CONSENT! \nKindly ask your legal guardian to register for you`);
    
        var wrongFormatFields = wrongFormat(data);
        if(wrongFormatFields != '') return alert(`WRONG FORMAT! \nThere are wrong formatted fields in this category/ies: \n${wrongFormatFields}`);

        console.log(data);
        
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
        };
        
        const response = await fetch('/editCustomer', options);
        const dataStream = await response.json();

        if(dataStream) return alert(`Username Taken! \n This username is already taken.`);
        cancelProfileClick();
        return alert('User Details changed and Saved!')
    }
    
    if(isChangePassword){
        var password = document.getElementById("password").value;
        var newPassword = document.getElementById("newPassword").value;

        var data = {password, newPassword, oldUsername};

        var missingFields = await missingData(data);
        if(missingFields != '') return alert(`EMPTY FIELDS! \nThere are empty fields in this category/ies: \n${missingFields}`);

        var validatedPassword = toValidatePassword(newPassword);
        if(validatedPassword != '') return alert(validatedPassword);

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
        };
        
        const response = await fetch('/passwordChange', options);
        const dataStream = await response.json();

        if(!dataStream) return alert('INCORRECT PASSWORD!')
        cancelProfileClick();
        return alert('Password changed and Saved!')
    }
}

function editProfileClick(){
    enableCustomers();
    document.getElementById("buttonSaveCancel").style.display = "block";
    document.getElementById("editProfile").style.display = "none";
    isChangeProfile = true;
}

function cancelProfileClick(){
    disableCustomers();
    document.getElementById("buttonSaveCancel").style.display = "none";
    document.getElementById("editProfile").style.display = "block";
    document.getElementById("changePasswordButtonDiv").style.display = "block";
    document.getElementById("changePasswordDiv").style.display = "none";
    isChangePassword = false;
    isChangeProfile = false;
}

function changePassword(){
    document.getElementById("changePasswordButtonDiv").style.display = "none";
    document.getElementById("changePasswordDiv").style.display = "block";
    document.getElementById("buttonSaveCancel").style.display = "block";
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

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const currentMonth = currentDate.getMonth();
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log(age);
    return age;
}

async function missingData(data){
    var missingVariable = "";
    Object.entries(data).forEach(([key, value]) => {
            if (key != 'isDeleted' && value == '') {
                missingVariable += `- ${key}\n`
            }
    });

    return missingVariable;
}

function wrongFormat(data){
    var wrongFormatReturn = ''
    if(!validatePhoneNumber(data.phone)) {
       wrongFormatReturn = '- Phone\n'
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

function toValidatePassword(coPassword){
    if(coPassword.includes(" ")) return (`NEW PASSWORD CONTAINS SPACES! \nPassword should not contain spaces`);
    if(coPassword.length < 8) return (`NEW PASSWORD TOO SHORT! \nPassword should be alteast 8 characters long`);

    return ''
}

async function bookCancel(){
    const bookIdValue = document.getElementById("bookDate").value.split(" | ");
    const bookStats = document.getElementById("appointmentStatus").innerHTML;

    if(bookStats != 'Booking Placed' && bookStats != 'Confirmed') return alert("Appointment Cancelled Error!\nCancel this appointment is not allowed!")
    if(!confirm(`Appointment Cancel Confirmation:\n Do you want to cancel your appointment on ${bookIdValue[1]}?`)) return

    var bookId = bookIdValue[0];
    var data = {bookId};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
    };
    
    const response = await fetch('/changeBookStatusByBookId', options);
    const dataStream = await response.json();
    
    alert('Appointment Cancelled!\nRefreshing Appointments');
    getUserBookings();
}

async function orderCancel(){
    const orderNumberValue = document.getElementById("orderNumber").value;
    const orderStats = document.getElementById("orderStatus").innerHTML;

    if(orderStats != 'Order Placed' && orderStats != 'Confirmed' && orderStats != 'Preparing') return alert("Order Cancelled Error!\nCancel this order is not allowed!")
    if(!confirm(`Order Cancel Confirmation:\n Do you want to cancel your order (${orderNumberValue})?`)) return

    var data = {orderNumberValue};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
    };
    
    const response = await fetch('/changeOrderStatusByOrderNumber', options);
    const dataStream = await response.json();
    
    alert('Appointment Cancelled!\nRefreshing Cart');
    getUserCart();
}
