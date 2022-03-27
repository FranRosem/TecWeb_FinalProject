debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
const bearerParams = {
    headers: { 
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
    }
};
let updateForm = document.getElementById('update-movie-form-frm');
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

function transformDate(date)
{
    let splitedHour = date.split('T');
    let hour = splitedHour[1].split(':');
    return hour[0] + ':' + hour[1];
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

async function fetGetMovie()
{
    debugger;
    var movieId = getParameterByName('movie-id');
    var franchiseId = getParameterByName('franchise-id');
    let responseMovie = await fetch(`${urlFranchise}/${franchiseId}/movies/${movieId}`, bearerParams);
    let responseFranchise = await fetch(`${urlFranchise}/${franchiseId}`, bearerParams);
    if(responseMovie.status === 200 && responseFranchise.status === 200) {
        var franchiseData = await responseFranchise.json();

        [franchiseData].map(f => {
            debugger;
            var imageUrl = f.imagePath? `${baseRawUrl}/${sanatizePath(f.imagePath)}` : "";
            var franchiseLink = document.getElementById('franchise-link');
            franchiseLink.appendChild(document.createTextNode(f.franchise));
            franchiseLink.setAttribute('href', `franchise-details.html?id=${f.id}`)
        });
        
        var data = await responseMovie.json();
        [data].map(movie => {
            debugger;
            var movieLink = document.getElementById('movie-link');
            movieLink.appendChild(document.createTextNode(movie.title));
            movieLink.href = `movies-watching.html?franchise=${franchiseId}&movie=${movieId}`;
            document.getElementById('movie-name').appendChild(document.createTextNode(`Update "${movie.title}"`));
            document.getElementById('title-movie-name').appendChild(document.createTextNode(`Update "${movie.title}"`));

            updateForm['name'].setAttribute('value', movie.title);
            updateForm['description'].value = movie.description;
            updateForm.duration.value = transformDate(movie.duration);
            updateForm.gross.setAttribute('value', movie.gross);
        });
    } else {
        var error = await responseMovie.text();
        console.log(error);
    }
}

async function updateFormMovie(event)
{
    debugger;
    var franchiseID = parseInt(getParameterByName('franchise-id'));
    var movieID = parseInt(getParameterByName('movie-id'));

    let url = `${urlFranchise}/${franchiseID}/movies/${movieID}/form`;

    console.log(event.currentTarget);
    event.preventDefault();

    const formData = new FormData();
    formData.append('FilmFranchiseId', franchiseID);
    formData.append('Title', getUpdatedValue(updateForm['name'].value, event.currentTarget.name.value));
    formData.append('Duration', getUpdatedValue(updateForm['duration'].value, event.currentTarget.duration.value));
    formData.append('Gross', getUpdatedValue(parseFloat(updateForm['gross'].value), parseFloat(event.currentTarget.gross.value)));
    formData.append('Description', getUpdatedValue(updateForm['description'].value, event.currentTarget.description.value));
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
        alert("movie updated");
        location.href = `movies-watching.html?franchise=${franchiseID}&movie=${movieID}`
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
        fetGetMovie();
        document.getElementById('update-movie-form-frm').addEventListener('submit', updateFormMovie);
    }
});