debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
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

function PostFormFranchise(event)
{
    debugger;
    event.preventDefault();
    let url = `${baseUrl}/filmfranchises/form`;
    
    if(!event.currentTarget.name.value)
    {
        event.currentTarget.name.style.backgroundColor = 'red';
        return;
    }
    
    const formData = new FormData();
    formData.append('Franchise', event.currentTarget.name.value);
    formData.append('FilmProductor', event.currentTarget.productor.value);
    formData.append('FilmProducer', event.currentTarget.producer.value);
    formData.append('FirstMovieYear', parseInt(event.currentTarget.firstYear.value));
    formData.append('LastMovieYear', parseInt(event.currentTarget.lastYear.value));
    formData.append('Description', event.currentTarget.description.value);
    formData.append('MovieCount', parseInt(event.currentTarget.movieCount.value));
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
        if(response.status === 201){
            alert('franchise was created');
            window.location.href = "index.html";
        } else {
            alert("no se que paso");
            response.text()
            .then((error)=>{
                alert(error);
            });
        }
        window.location.href = "index.html";
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
        document.getElementById('create-franchise-form-frm').addEventListener('submit', PostFormFranchise);
    }
});