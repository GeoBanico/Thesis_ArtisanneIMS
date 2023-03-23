var currentUser = {username:null, userType:null};

window.onload = async function(){
    getUserDetails();
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