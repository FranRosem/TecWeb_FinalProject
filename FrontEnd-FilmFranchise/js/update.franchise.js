debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
const bearerParams = {
    headers: { 
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
    }
};

let updateForm = document.getElementById('update-franchise-form-frm');
//import sanatizePath from "./utility.oksem.js";

function sanatizePath(source)
{
    let splitedUrl = source.split("\\");
    return splitedUrl[0] + "/" + splitedUrl[1] + "/" + splitedUrl[2];
}

function sanatizeDate(date)
{
    let splitedHour = date.split('T');
    let hour = splitedHour[1].split(':');
    return hour[0] + 'h ' + hour[1] + 'm';
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getUpdatedValue(old, newer)
{
    return (old == '') ? newer : old;
}

async function fetGetFranchise()
{
    debugger;
    var idQuery = getParameterByName('franchise-id');
    let response = await fetch(`${urlFranchise}/${idQuery}`, bearerParams);
    if (response.status === 200) {
        var data = await response.json();
        [data].map(franchise => {        
            var franchiseLink = document.getElementById('franchise-name-link');
            franchiseLink.appendChild(document.createTextNode(franchise.franchise));
            franchiseLink.href = `franchise-details.html?id=${franchise.id}`;
            
            document.getElementById('franchise-name').appendChild(document.createTextNode(`Update "${franchise.franchise}"`));
            document.getElementById('franchise-title-name').appendChild(document.createTextNode(`Update "${franchise.franchise}"`));
            
            updateForm['name'].value = franchise.franchise;
            updateForm['productor'].value = franchise.filmProductor;
            updateForm.producer.value = franchise.filmProducer;
            updateForm.firstYear.value = franchise.firstMovieYear;
            updateForm.lastYear.value = franchise.lastMovieYear;
            updateForm.description.value = franchise.description;
            updateForm.movieCount.value = franchise.movieCount;
        });

    } else {
        var error = await response.text();
        console.log(error);
    }
}

async function UpdateFormFranchise(event)
{
    debugger;
    var idQuery = parseInt(getParameterByName('franchise-id'));
    let url = `${urlFranchise}/${idQuery}/form`;

    console.log(event.currentTarget);
    event.preventDefault();

    const formData = new FormData();
    formData.append('Franchise', getUpdatedValue(updateForm['name'].value, event.currentTarget.name.value));
    formData.append('FilmProductor', getUpdatedValue(updateForm['productor'].value, event.currentTarget.productor.value));
    formData.append('FilmProducer', getUpdatedValue(updateForm['producer'].value, event.currentTarget.producer.value));
    formData.append('FirstMovieYear', getUpdatedValue(parseInt(updateForm['firstYear'].value), parseInt(event.currentTarget.firstYear.value)));
    formData.append('LastMovieYear', getUpdatedValue(parseInt(updateForm['lastYear'].value), parseInt(event.currentTarget.lastYear.value)));
    formData.append('Description', getUpdatedValue(updateForm['description'].value, event.currentTarget.description.value));
    formData.append('MovieCount', getUpdatedValue(parseInt(updateForm['movieCount'].value), parseInt(event.currentTarget.movieCount.value)));
    formData.append('Image', event.currentTarget.image.files[0]);

    const params = {
        method: 'POST',
        headers: { 
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
        },
        body: formData
    };

    var response = await fetch(url, params);

    if (response.status == 200) {
        alert("franchise updated");
        location.href = `franchise-details.html?id=${idQuery}`
    } else {
        alert("no se que paso");
        var error = await response.text();
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    if (!Boolean(sessionStorage.getItem("jwt"))) {
        window.location.href = "login.html";
    }
    else {
        if (sessionStorage.getItem("userType") === "NormalUser") {
            document.querySelector('.crud-settings').style.display = "none";
        }
        fetGetFranchise();
        document.getElementById('update-franchise-form-frm').addEventListener('submit', UpdateFormFranchise);
    }
});