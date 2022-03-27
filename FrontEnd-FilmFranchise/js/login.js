debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
let loginForm = document.getElementById('login-frm');
//import sanatizePath from "./utility.oksem.js";

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function assignUserRole(event, userID, roleID) {
    debugger;
    console.log(event.currentTarget);
    event.preventDefault();
    let url = `${baseUrl}/auth/userRole`;

    var data = {
        userId: userID,
        roleId: roleID
    }
    debugger;
    fetch(url, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((response) => {
        debugger;
        if (response.status === 200) {
            debugger;
            response.json().then((data)=>{
                console.log(data);
            });
        } else {
            response.text().then((data) => {
                debugger;
                console.log(data);
            });
        }
    }).catch((response) => {
        debugger;
        console.log(response);
    });
}

function PutLoginForm(event) {
    debugger;
    console.log(event.currentTarget);
    event.preventDefault();
    const url = `${baseUrl}/auth/Login`;

    if(!Boolean(event.currentTarget["mail"].value)){
        alert('email and password is required');
        return;
    }

    var data = {
        Email: event.currentTarget["mail"].value,
        Password: event.currentTarget.password.value
    }

    fetch(url, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status === 200) {
            response.json().then((data)=>{
                debugger;
                var mytoken = parseJwt(data.token);
                var myRole = mytoken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                var myId = mytoken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"][0];
                if (!myRole) {
                    assignUserRole(event, myId, "0385ebd2-d2af-4751-9b6e-f5213159ea92");
                    alert('Por favor, ingresa de nuevo');
                    return;
                }
                window.location.reload();
                sessionStorage.setItem("jwt", data.token);
                sessionStorage.setItem("userType", myRole);
                window.location.href = "index.html";
                
            });
        } else {
            response.text().then((data) => {
                debugger;
                console.log(data);
            });
        }
    }).catch((response) => {
        debugger;
        console.log(response);
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.getElementById("login-frm").addEventListener("submit", PutLoginForm);
});