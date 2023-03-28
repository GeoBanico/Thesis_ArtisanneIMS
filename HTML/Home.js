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
    
    if(currentUser.userType == 'Customer') document.getElementById('forEmployee').style.display = 'none';
    if(currentUser.userType == 'Manager' || currentUser.userType == 'Owner' ) {
        const changeDisplay = document.getElementsByClassName('forOwnerManager');
        for (let i = 0; i < changeDisplay.length; i++) {
            changeDisplay[i].style.display = 'none'
        }
    }
} 