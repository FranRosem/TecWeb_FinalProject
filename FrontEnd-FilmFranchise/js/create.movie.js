debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
const bearerParams = {
    headers: { 
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
    }
}
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

let filmFranchiseID = parseInt(getParameterByName('franchise-id'));

function fetFranchise()
{
    debugger;
    let status;
    fetch(`${urlFranchise}/${filmFranchiseID}`, bearerParams)
    .then((response) => { 
        status = response.status;
        return response.json();
    })
    .then((data) => {
        if(status == 200) {
            console.log(data)
            let something = [data].map( f => { 
                debugger;
                document.getElementById('franchise-name').appendChild(document.createTextNode(`${f.franchise}`));
                document.getElementById('franchise-name').href = `franchise-details.html?id=${filmFranchiseID}`;
                document.getElementById('title-franchise-name').appendChild(document.createTextNode(`Create Movie of ${f.franchise}`));
                return "something";
            });
            console.log(something);
        } else {
            console.log(data);
        }
    });
}

function PostFormMovies(event)
{
    debugger;
    event.preventDefault();
    let url = `${baseUrl}/filmfranchises/${filmFranchiseID}/movies/form`;

    if(!event.currentTarget.name.value)
    {
        event.currentTarget.name.style.backgroundColor = 'red';
        return;
    }
    
    const formData = new FormData();
    formData.append('FilmFranchiseId', parseInt(filmFranchiseID));
    formData.append('Title', event.currentTarget.name.value);
    formData.append('Duration', event.currentTarget.duration.value);
    formData.append('Gross', parseFloat(event.currentTarget.gross.value));
    formData.append('Description', event.currentTarget.description.value);
    formData.append('Image', event.currentTarget.image.files[0]);
    
    debugger;
    fetch(url, {
        method: 'POST',
        headers: { 
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
        },
        body: formData
    }).then(response => {
        debugger;
        if(response.status === 201) {
            alert('movie was created');
            window.location.href = `franchise-details.html?id=${filmFranchiseID}`;
        } else {
            alert("no se que paso");
            response.text()
            .then((error)=>{
                alert(error);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    if (!Boolean(sessionStorage.getItem("jwt"))) {
        window.location.href = "login.html";
    }
    else {
        if (sessionStorage.getItem("userType") === "NormalUser") {
            document.querySelector('.crud-settings').style.display = "none";
        }
        fetFranchise();
        document.getElementById('create-movie-form-frm').addEventListener('submit', PostFormMovies);
    }
});