var currentUser = {username:'', userType:''}

window.onload = {}

document.getElementById("login_click").onclick = function() {userLogin()};
async function userLogin() {
    var userEmail = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var data = {userEmail, password};
    
    const options =  {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
    body: JSON.stringify(data)
    };

    const response = await fetch('/userLogin', options);
    const dataStream = await response.json();

    await checkHasAccount(dataStream); 
}

async function checkHasAccount(user){
    const userHasAccount =  JSON.stringify(user.userCount) != 0;
    const incorrectLabel = document.getElementById("incorrectLabel");

    if(!userHasAccount){
        console.log("no user");
        document.getElementById("username").value = '';
        document.getElementById("password").value = '';
        document.getElementById("username").focus();
        incorrectLabel.style = 'display: block';
    }
    else{
        await saveLogin(user);
        window.location.href = "./Home.html";
    }
}

async function saveLogin(user){
    currentUser.username = user.user[0].username;
    
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(user.user[0])
        };
    
    const response = await fetch('/searchUserType', options);
    const dataStream = await response.json();

    currentUser.userType = dataStream;
    
    //save to cookies
    saveToCookies();
}

function saveToCookies(){

    //delete cookies
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        // Set the cookie's expiration date to a date in the past
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Calculate the expiration date of the cookies (7 days from now)
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds

    // Create the cookie strings
    const usernameCookie = `username=${currentUser.username};expires=${expirationDate.toUTCString()};path=/`;
    const userTypeCookie = `userType=${currentUser.userType};expires=${expirationDate.toUTCString()};path=/`;

    // Save the cookies
    document.cookie = usernameCookie;
    document.cookie = userTypeCookie;
}