let billing = document.getElementById("billing");
let billingFoot = document.getElementById('billing-foot');

billing.addEventListener('mousemove', function() {
    if (billing.value > 900) {
        let valore = (billing.value / 1000).toFixed(1);
        if (valore.endsWith(".0")) {
            let unique = Math.floor(valore);
            billingFoot.innerHTML = unique + "M€";
        } else {
            billingFoot.innerHTML = valore + "M€";
        }
    } else {
        billingFoot.innerHTML = billing.value + "k€";
    }
});

let advancedFilter = [
    "search-digital-agency",
    "search-media-center",
    "search-creative-agency",
    "search-perform-agency",
    "search-rome",
    "search-milan",
    "search-naples",
    "search-seo",
    "search-sea",
    "search-develop",
    "search-creativity",
    "search-video-production",
    "search-media",
    "search-blockchain",
    "search-ai",
    "search-retail-media",
    "search-dropship",
    "search-tv",
    "search-digital",
    "search-press",
    "search-radio",
    "search-connected",
    "search-google",
    "search-microsoft",
    "search-amazon",
    "search-conversion",
    "search-awareness"
];

let checked = [];
let paroleChiave = [];
let city = [];
let typeAgency = [];

let cards = document.getElementsByClassName('card-account');

function filter() {
    city = [];
    paroleChiave = [];
    checked = [];
    typeAgency = [];

    var parola;

    for (let advF = 0; advF < advancedFilter.length; advF++) {
        if (document.getElementById(advancedFilter[advF]).checked) {
            if (!checked.includes(advancedFilter[advF])) {
                checked.push(advancedFilter[advF]);
                if (advancedFilter[advF] != 'search-rome' && advancedFilter[advF] != 'search-milan' && advancedFilter[advF] != 'search-naples' && advancedFilter[advF] != 'search-digital-agency' && advancedFilter[advF] != 'search-media-center' && advancedFilter[advF] != 'search-creative-agency'  && advancedFilter[advF] != 'search-perform-agency') {
                    parola = advancedFilter[advF].replace("search-", "");
                    paroleChiave.push(parola);
                }
            } 
        } else {
            checked.indexOf(advancedFilter[advF], 1);
            paroleChiave.indexOf(parola, 1);
        }
    }

    if (checked.includes('search-rome')) {
        if (!city.includes("rome")) {
            city.push("rome");
        }
    } else {
        city.indexOf("rome", 1);
    }

    if (checked.includes('search-milan')) {
        if (!city.includes("milan")) {
            city.push("milan");
        }
    } else {
        city.indexOf("milan", 1);
    }

    if (checked.includes('search-naples')) {
        if (!city.includes("naples")) {
            city.push("naples");
        }
    } else {
        city.indexOf("naples", 1);
    }

    if (checked.includes('search-digital-agency')) {
        if (!typeAgency.includes("digital-agency")) {
            typeAgency.push("digital-agency");
        }
    } else {
        typeAgency.indexOf("digital-agency", 1);
    }

    if (checked.includes('search-media-center')) {
        if (!typeAgency.includes("media-center")) {
            typeAgency.push("media-center");
        }
    } else {
        typeAgency.indexOf("media-center", 1);
    }

    if (checked.includes('search-creative-agency')) {
        if (!typeAgency.includes("creative-agency")) {
            typeAgency.push("creative-agency");
        }
    } else {
        typeAgency.indexOf("creative-agency", 1);
    }

    if (checked.includes('search-perform-agency')) {
        if (!typeAgency.includes("perform-agency")) {
            typeAgency.push("perform-agency");
        }
    } else {
        typeAgency.indexOf("naples", 1);
    }

    for (let cardAcc of cards) {
        if (
            paroleChiave.some(allInfo => cardAcc.classList.contains(allInfo)) &&
            city.some(citys => cardAcc.classList.contains(citys)) &&
            typeAgency.some(typeA => cardAcc.classList.contains(typeA))
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