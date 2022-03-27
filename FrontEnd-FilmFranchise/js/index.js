const baseRawUrl = 'http://localhost:5030';
const baseUrl = `${baseRawUrl}/api`;
const urlFranchise = `${baseUrl}/filmfranchises`;
const bearerParams = {
    headers: { 
        //"Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
    },
    //method: 'GET'
};
//import sanatizePath from "./utility.oksem.js";


function sanatizePath(source)
{
    let splitedUrl = source.split("\\");
    return splitedUrl[0] + "/" + splitedUrl[1] + "/" + splitedUrl[2];
}

async function fetGetFranchisesCarousel()
{
    debugger;
    let response = await fetch(urlFranchise, bearerParams);

    if (response.status == 200) {
        debugger;
        let data = await response.json();
        data.map( franchise => {
            debugger;
            var imageUrl = franchise.imagePath? `${baseRawUrl}/${sanatizePath(franchise.imagePath)}` : "";
            var element = ` <a href="franchise-details.html?id=${franchise.id}">
                                <div class="hero__items set-bg" data-setbg="${imageUrl}" style="background-image: url(${imageUrl}); height: 600px;">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="hero__text">
                                                <div class="movies">${franchise.movieCount} Películas</div>
                                                <div class="label">${franchise.filmProductor} &copy</div>
                                                <h2>${franchise.franchise}</h2>
                                                <p>${franchise.description}</p>
                                                <a href="franchise-details.html?id=${franchise.id}"><span>${franchise.filmProducer}</span><i class="fa fa-angle-right"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>`;
            $('.owl-carousel').trigger('add.owl.carousel', element).trigger('update.owl.carousel').trigger('refresh.owl.carousel');
        });
    } else {
        var errorText = await response.text();
        alert(errorText);
    }
}

async function fetGetLastAdded()
{
    debugger;
    let response = await fetch(urlFranchise, bearerParams);
    if (response.status == 200) {
        debugger;
        let data = await response.json();
        let franchisesLi = data.map( franchise => {
            var imageUrl = franchise.imagePath? `${baseRawUrl}/${sanatizePath(franchise.imagePath)}` : "";
            return `<div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="product__item">
                            <a href="franchise-details.html?id=${franchise.id}">
                            <div class="product__item__pic set-bg" data-setbg="${imageUrl}" style="background-image: url(${imageUrl});">
                                <div class="ep">${franchise.movieCount} Películas</div>
                                <div class="comment"><i class="fa fa-comments"></i> ${Math.floor(Math.random() * 31)}</div>
                                <div class="view"><i class="fa fa-eye"></i> ${Math.floor(Math.random() * 10001)}</div>
                            </div>
                            </a>
                            <div class="product__item__text">
                                <ul>
                                    <li>Active</li>
                                    <li>Movie</li>
                                </ul>
                                <h5><a href="franchise-details.html?id=${franchise.id}">${franchise.franchise}</a></h5>
                            </div>
                        </div>
                    </div>`;
        });
        
        var franchiseContent = franchisesLi.join('');
        document.getElementById('recently-added').innerHTML = franchiseContent;
        
    } else {
        var errorText = await response.text();
        alert(errorText);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    debugger;
    if (!Boolean(sessionStorage.getItem("jwt"))) {
        window.location.href = "login.html";
    }
    else {
        if (sessionStorage.getItem("userType") === "NormalUser") {
            document.querySelector('.crud-settings').style.display = "none";
        }
        fetGetFranchisesCarousel();
        fetGetLastAdded();
    }
});