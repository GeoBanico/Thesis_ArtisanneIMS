document.getElementById("signup_click").onclick = function() {addCustomer()};
async function addCustomer() {
    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("familyname").value;
    var birthday = document.getElementById("birthday").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var status = await getStatus(birthday);
    var isDeleted = false;

    var data = {firstName, lastName, birthday, phone, address, email, username, password, confirmPassword, status, isDeleted};
    
    var missingFields = await missingData(data);
    if(missingFields != '') return alert(`EMPTY FIELDS! \nThere are empty fields in this category/ies: \n${missingFields}`);

    if(calculateAge(birthday) < 12) return alert(`BELOW AGE OF CONSENT! \nKindly ask your legal guardian to register for you`);

    var wrongFormatFields = wrongFormat(data);
    if(wrongFormatFields != '') return alert(`WRONG FORMAT! \nThere are wrong formatted fields in this category/ies: \n${wrongFormatFields}`);

    var validatedPassword = toValidatePassword(password, confirmPassword);
    if(validatedPassword != '') return alert(validatedPassword);

    const options =  {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
    body: JSON.stringify(data)
    };

    const response = await fetch('/addCustomer', options);
    const dataStream = await response.json();

    if(dataStream != '') alert(`USERNAME TAKEN! \nThis username (${await dataStream}) is already taken!`);
    else {
        alert('Customer added\n Redirecting to log-in page');
        document.getElementById("login-hidden").style.display = 'block';
        document.getElementById("register-hidden").style.display = 'none';
        document.getElementById("btn").style.left = "0"
    }
}

async function getStatus(birthday){
    const age = calculateAge(birthday);
    var customerStatus = '';
    if(age <= 23) customerStatus = 'Student';
    else if(age > 60) customerStatus = 'Senior Citizen';
    else customerStatus = 'Regular';

    return customerStatus;
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

function toValidatePassword(password, coPassword){
    if(password.includes(" ")) return (`PASSWORD CONTAINS SPACES! \nPassword should not contain spaces`);
    if(password.length < 8) return (`PASSWORD TOO SHORT! \nPassword should be alteast 8 characters long`);
    if(password != coPassword) return (`PASSWORD MISMATCH! \nPasswords do not match`);

    return ''
}