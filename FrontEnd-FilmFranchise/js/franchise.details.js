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

async function fetGetFranchise()
{
    debugger;
    var idQuery = getParameterByName('id');
    let franchise = [];
    let response = await fetch(`${urlFranchise}/${idQuery}`, bearerParams);
    if(response.status === 200) {
        var data = await response.json();
        let franchisesLiMapped = [data].map(franchise => {        
            var imageUrl = franchise.imagePath? `${baseRawUrl}/${sanatizePath(franchise.imagePath)}` : "";
            document.getElementById('franchise-name').appendChild(document.createTextNode(franchise.franchise));
            document.getElementById('create-movie-link').href = `create-movie-form.html?franchise-id=${franchise.id}&franchise=${franchise.franchise}`;
            document.getElementById('update-franchise-link').href = `update-franchise-form.html?franchise-id=${franchise.id}`;
            return `<div class="col-lg-3">
                        <div class="anime__details__pic set-bg" data-setbg="${imageUrl}" style="background-image: url(${imageUrl});">
                            <div class="comment"><i class="fa fa-comments"></i> 11</div>
                            <div class="view"><i class="fa fa-eye"></i> 9141</div>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="anime__details__text">
                            <div class="anime__details__title">
                                <h3>${franchise.franchise}</h3>
                                <span>${franchise.filmProductor} &copy</span>
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
                            <p>${franchise.description}</p>
                            <div class="anime__details__widget">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Film Producer:</span>${franchise.filmProducer}</li>
                                            <li><span>Studios:</span>${franchise.filmProductor} Inc</li>
                                            <li><span>Películas:</span>${franchise.movieCount} ediciones</li>
                                            <li><span>Año de Inicio:</span>${franchise.firstMovieYear}</li>
                                            <li><span>Última Salida:</span>${franchise.lastMovieYear}</li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Scores:</span> 7.31 / 1,515</li>
                                            <li><span>Rating:</span> 8.5 / 161 times</li>
                                            <li><span>Quality:</span> HD</li>
                                            <li><span>Views:</span> 131,541</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="anime__details__btn">
                                <a href="#" class="follow-btn"><i class="fa fa-star-o"></i>Votar</a>
                                <!-- a href="franchise-details.html?id=${franchise.id}" class="follow-btn">Mostrar Películas</a -->
                            </div>
                        </div>
                    </div>`
        });
        var franchisesContent = `${franchisesLiMapped.join('')}`;
        document.getElementById('franchise-data').innerHTML = franchisesContent;
        franchise = [data];

    } else {
        var error = await response.text();
        console.log(error);
    }
}

async function fetGetMovies()
{
    debugger;
    var idQuery = getParameterByName('id');
    const url = `${urlFranchise}/${idQuery}/movies`;
    let response = await fetch(url, bearerParams);
    try{
        debugger;
        if(response.status == 200){
            let data = await response.json();
            let moviesLi = data.map( movie => { 
            
            const imageUrl = movie.imagePath? `${baseRawUrl}/${sanatizePath(movie.imagePath)}` : "";
            return `<div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="product__item">
                            <a href="movies-watching.html?franchise=${movie.filmFranchiseId}&movie=${movie.id}">
                            <div class="product__item__pic set-bg" data-setbg="${imageUrl}" style="background-image: url(${imageUrl});">
                                <div class="ep">${movie.gross} Millones <i class="fa fa-money"></i></div>
                                <div class="comment">${sanatizeDate(movie.duration)} <i class="fa fa-clock-o"></i></div>
                                <div class="view"><i class="fa fa-eye"></i> ${Math.floor(Math.random() * 10001)}</div>
                            </div>
                            </a>
                            <div class="product__item__text">
                                <ul>
                                    <li>Active</li>
                                    <li>Movie</li>
                                </ul>
                                <h5 class="text-align"><a href="movies-watching.html?franchise=${movie.filmFranchiseId}&movie=${movie.id}">${movie.title.toUpperCase()}<p style="color: white;">${movie.description}</p></a></h5>
                            </div>
                        </div>
                    </div>`
            });
            var movieContent = moviesLi.join('');
            document.getElementById('movies-data').innerHTML = movieContent;
        } else {
            var errorText = await response.text();
            alert(errorText);
        }
    } catch(error){
        var errorText = await error.text();
        alert(errorText);
    }
}

function fetDeleteFranchise() {
    debugger;
    var idQuery = getParameterByName('id');
    var r = confirm("Are you sure you want to delete this franchise?");
    if (r == true) {
        let url = `${urlFranchise}/${idQuery}`;
        fetch(url, { 
            method: 'DELETE',
            headers: { 
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
            }
        }).then((data)=>{
            if(data.status === 200){
                alert('deleted');
                window.location.href = "index.html";
            }
        }); 
        location.reload();
        window.location.href = "index.html";
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
        fetGetFranchise();
        fetGetMovies();
        document.getElementById('fetch-btn-delete').addEventListener('click', fetDeleteFranchise);
    }
});