let advancedFilter = [];
let checked = [];
let paroleChiave = [];
let city = [];
let typeAgency = [];

document.addEventListener('DOMContentLoaded', function() {
    function fil() {
        let allFil = document.querySelectorAll("input[type='checkbox']");
        for (let fil of allFil) {
            advancedFilter.push(fil.id);
        }
    }

    if (window.innerWidth > 1250) {
        document.querySelector('.filtr').open = true;
    }

    fil();
});

window.addEventListener('scroll', function () {
    const filters = document.getElementById('filters');
    if (this.window.innerWidth > 1250) {
        if (window.scrollY > 150) {
            filters.style.position = "fixed";
            filters.style.top = "20px";
            filters.style.left = "20px";
            filters.style.height = "auto";
            filters.style.width = "20%";
        } else {
            filters.style.position = "static";
            filters.style.width = "96%";
            filters.style.height = "auto";
        }
    }
});


let cards = document.getElementsByClassName('card-account');

function filter() {
    city = [];
    paroleChiave = [];
    checked = [];
    typeAgency = [];

    var parola;
    var typeA;
    var loc;

    let agencyTypes = document.getElementById("agencyType").querySelectorAll('li > input');
    let locationFil = document.getElementById("locationFil").querySelectorAll('li > input');

    for (let a of agencyTypes) {
        // console.log("Agency type: " + a.id);
        if(a.checked) {
            typeA = a.id.replace("search-", "");
            typeAgency.push(typeA);
        }
    }

    for (let a of locationFil) {
        // console.log("Agency type: " + a.id);
        if (a.checked) {
            loc = a.id.replace("search-", "");
            city.push(loc);
        }
    }

    // console.log(typeAgency)

    for (let advF = 0; advF < advancedFilter.length; advF++) {
        if (document.getElementById(advancedFilter[advF]).checked) {
            if (!checked.includes(advancedFilter[advF])) {
                checked.push(advancedFilter[advF]);
                if (advancedFilter[advF] !== 'search-' + typeAgency[advF]) {
                    parola = advancedFilter[advF].replace("search-", "");
                    paroleChiave.push(parola);
                }
            } 
        } else {
            checked.indexOf(advancedFilter[advF], 1);
            paroleChiave.indexOf(parola, 1);
        }
    }

    for (let a of typeAgency) {
        if (checked.includes('search-' + a)) {
            if (!typeAgency.includes(a)) {
                typeAgency.push(a);
            }
        } else {
            let index = typeAgency.indexOf(a);
            if (index !== -1) {
                typeAgency.splice(index, 1);
            }
        }
    }    

    for (let a of city) {
        if (checked.includes('search-' + a)) {
            if (!city.includes(a)) {
                city.push(a);
            }
        } else {
            let index = city.indexOf(a);
            if (index !== -1) {
                city.splice(index, 1);
            }
        }
    }  

    for (let cardAcc of cards) {
        if (
            typeAgency.some(agencyType => cardAcc.classList.contains(agencyType)) 
            &&
            city.some(city => cardAcc.classList.contains(city)) 
            &&
            paroleChiave.some(paroleChiave => cardAcc.classList.contains(paroleChiave))
        ) {
            cardAcc.style.display = "flex";
        } else {
            cardAcc.style.display = "none";
        }
    }
    
}

function resetFilter() {
    for (let resetA = 0; resetA < advancedFilter.length; resetA++) {
        document.getElementById(advancedFilter[resetA]).checked = true;
    }

    filter();
}