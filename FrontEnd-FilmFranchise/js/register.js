debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
//import sanatizePath from "./utility.oksem.js";


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

async function registerUser(event){
    debugger;
    event.preventDefault();
    let url = `${baseUrl}/auth/User`

    if(!Boolean(event.currentTarget["email"].value)){
        alert('email required');
        return;
    }

    if(!Boolean(event.currentTarget["password"].value)){
        alert('password id required');
        return;
    }

    if(!Boolean(event.currentTarget["confirmPassword"].value)){
        alert('confirm your password');
        return;
    }

    debugger;
    var data = {
        email: event.currentTarget["email"].value,
        password: event.currentTarget["password"].value,
        confirmPassword: event.currentTarget["confirmPassword"].value,
    }

    var params = {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify(data)
    }
    debugger;
    
    let response = await fetch(url, params);
    if(response.status == 200){
        debugger;
        var data = await response.json();
        if(data.isSuccess){
            debugger;
            alert(data.token);
            location.href = "login.html";
        } else {
            alert(data);
        }
    } else {
        var data = await response.text()
        alert(data);
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    debugger;
    document.getElementById('register-frm').addEventListener('submit', registerUser);
});