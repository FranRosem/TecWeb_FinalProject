debugger;
const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
const bearerParams = {
    headers: { 
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
    }
};

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

async function fetGetMovie()
{
    debugger;
    var movieId = getParameterByName('movie');
    var franchiseId = getParameterByName('franchise');
    let responseMovie = await fetch(`${urlFranchise}/${franchiseId}/movies/${movieId}`, bearerParams);
    let responseFranchise = await fetch(`${urlFranchise}/${franchiseId}`, bearerParams);
    if(responseMovie.status === 200 && responseFranchise.status === 200) {
        var franchiseData = await responseFranchise.json();
        let franchiseCreator;
        [franchiseData].map(f => {
            debugger;
            var imageUrl = f.imagePath? `${baseRawUrl}/${sanatizePath(f.imagePath)}` : "";
            document.getElementById('franchise-link').appendChild(document.createTextNode(f.franchise));
            document.getElementById('player').setAttribute('poster',`${imageUrl}`);
            franchiseCreator = f.filmProductor;
        });
        
        var data = await responseMovie.json();
        let moviesLiMapped = [data].map(movie => {
            debugger;
            var imageUrl = movie.imagePath? `${baseRawUrl}/${sanatizePath(movie.imagePath)}` : "";
            document.getElementById('movie-link').appendChild(document.createTextNode(movie.title));
            document.getElementById('movie-name').appendChild(document.createTextNode(movie.title));
            document.getElementById('franchise-link').href = `franchise-details.html?id=${movie.filmFranchiseId}`;
            document.getElementById('update-movie-link').href = `update-movie-form.html?franchise-id=${franchiseId}&movie-id=${movieId}`;
            return `<div class="col-lg-3">
                        <div class="anime__details__pic set-bg" data-setbg="${imageUrl}" style="background-image: url(${imageUrl});">
                            <div class="comment"><i class="fa fa-comments"></i> 11</div>
                            <div class="view"><i class="fa fa-eye"></i> 9141</div>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="anime__details__text">
                            <div class="anime__details__title">
                                <h3>${movie.title}</h3>
                                <span>${franchiseCreator} &copy</span>
                            </div>
                            <div class="anime__details__rating">
                                <div class="rating">
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star-half-o"></i></a>
                                </div>
                                <span>1.029 Votes</span>
                            </div>
                            <p>${movie.description}</p>
                            <div class="anime__details__widget">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Duración:</span>${sanatizeDate(movie.duration)}</li>
                                            <li><span>Studios:</span>${franchiseCreator} Inc</li>
                                            <li><span>Price:</span>${movie.gross} Millones <i class="fa fa-money"></i></li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                        <li><span>Scores:</span> 7.31 / 1,515</li>
                                            <li><span>Rating:</span> 8.5 / 161 times</li>
                                            <li><span>Quality:</span> HD</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="anime__details__btn">
                                <a href="#" class="follow-btn"><i class="fa fa-star-o"></i>Votar</a>
                            </div>
                        </div>
                    </div>`
        });
        var moviesContent = `${moviesLiMapped.join('')}`;
        document.getElementById('movie-details').innerHTML = moviesContent;
        //franchise = listAnIndex;

    } else {
        var error = await responseMovie.text();
        console.log(error);
    }
}

function fetDeleteMovie() {
    debugger;
    var franchiseIdQuery = getParameterByName('franchise');
    var movieIdQuery = getParameterByName('movie');
    var r = confirm("Are you sure you want to delete this movie?");
    if (r == true) {
        let url = `${urlFranchise}/${franchiseIdQuery}/movies/${movieIdQuery}`;
        fetch(url, { 
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
            }
        }).then((data)=>{
            if(data.status === 200){
                alert('deleted');
                window.location.href = `franchise-details.html?id=${franchiseIdQuery}`;
                location.reload();
            }
        }); 
        location.reload();
        console.log(url);
        window.location.href = `franchise-details.html?id=${franchiseIdQuery}`;
    }
    else {
        alert("no eliminaste nada xd");
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
        document.getElementById('fetch-btn-delete').addEventListener('click', fetDeleteMovie);
    }
});