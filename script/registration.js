window.addEventListener("load", function() {
    document.getElementById('form-1-an').style.marginRight = 0 + "%";
    document.getElementById('form-1-an').style.height = "auto";
});

document.getElementById('founderName').addEventListener('keydown', function(event) {
    if (event.key == " ") {
        document.getElementById('founderName').value = document.getElementById('founderName').value + ", ";
    }
});

let referralClient = [];

function addClient() {
    let nameAndSurname = document.getElementById("nameAndSurname").value;
    let profession = document.getElementById("profession").value;
    let photo = document.getElementById("photo").files[0];
    let mainClientRef = document.getElementById("mainClientRef").value;
    let display = document.getElementById("nameAndSurnameRef");

    if (nameAndSurname !== "" && profession !== "" && photo !== undefined && mainClientRef !== "") {
        referralClient.push({
            nameAndSurname: nameAndSurname,
            profession: profession,
            photo: photo,
            mainClientRef: mainClientRef
        });

        let indice = referralClient.findIndex(client => client.nameAndSurname === nameAndSurname);
        let nome = referralClient[indice].nameAndSurname;

        display.value = display.value + nome + ", ";
    } else {
        alert("Compile all camp");
    }
}

function removeClient() {
    if (referralClient.length > 0) {
        referralClient.pop();
        
        let display = document.getElementById("nameAndSurnameRef");
        if (referralClient.length !== 0) {
            display.value = referralClient.map(client => client.nameAndSurname).join(", ") + ", ";
        } else {
            display.value = "";
        }
    } else {
        alert("No client to remove");
    }
}


let certificationPlatform = [];

function addCertification() {
    let platform = document.getElementById("platformForCert").value;
    let certification = document.getElementById("certificationFor").value;
    let display = document.getElementById("certificationPla");

    if (platform !== "" && certification !== "") {
        certificationPlatform.push({
            platform: platform.replace("-", " "),
            certification: certification.replace("-", " ")
        });

        let nome = certificationPlatform[certificationPlatform.length - 1].certification;
        display.value = display.value + nome + ", ";
    } else {
        alert("Compile all camp");
    }
}

function removeCertification() {
    if (certificationPlatform.length > 0) {
        certificationPlatform.pop();
        
        let display = document.getElementById("certificationPla");
        if (certificationPlatform.length !== 0) {
            display.value = certificationPlatform.map(client => client.certification).join(", ") + ", ";
        } else {
            display.value = "";
        }
    } else {
        alert("No certification to remove.");
    }
}

let citys = document.getElementById('location');
let cityChoose = [];

citys.addEventListener('change', function() {
    // console.log(citys.value);
    console.log(citys.value);
    if (citys.value !== "more") {
        if (!cityChoose.includes(citys.value)) {
            cityChoose.push(citys.value.replace("-", " "));
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('city');
            choose.innerHTML = citys.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
            choose.id = citys.value.replace("-", " ");
            choose.onclick = function() {
                deleteItem(choose.id);
            }
            document.getElementById('citys').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!cityChoose.includes(newCity)) {
                cityChoose.push(newCity.replace("-", " "));
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('city');
                choose.innerHTML = newCity.replace("-", " ") + "<span style = 'color: white;'>X</span>";
                choose.id = newCity.replace("-", " ");
                choose.onclick = function() {
                    deleteItem(choose.id);
                }
                document.getElementById('citys').appendChild(choose);
            }
        }
    }
})

function deleteItem(value) {
    let city = document.getElementById(value);
    // console.log(value);

    const index = cityChoose.indexOf(value);
    if (index > -1) {
        cityChoose.splice(index, 1);
    }

    if (city) {
        city.remove();
    }

    if (cityChoose.length == 0) {
        document.getElementById("location").value = "";
    }
}

let services = document.getElementById('mainServices');
let servicesChoose = [];

services.addEventListener('change', function() {
    // console.log(citys.value);
    if (!servicesChoose.includes(services.value)) {
        servicesChoose.push(services.value.replace("-", " "));
        // console.log(cityChoose);
        let choose = document.createElement('div');
        choose.classList.add('service');
        choose.innerHTML = services.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
        choose.id = services.value.replace("-", " ");
        choose.onclick = function() {
            deleteItemMainServices(choose.id);
        }
        document.getElementById('services').appendChild(choose);
    }
})

function deleteItemMainServices(value) {
    let service = document.getElementById(value);
    // console.log(value);

    const index = servicesChoose.indexOf(value);
    if (index > -1) {
        servicesChoose.splice(index, 1);
    }

    if (service) {
        service.remove();
    }

    if (servicesChoose.length == 0) {
        document.getElementById("mainServices").value = "";
    }
}

let Dservices = document.getElementById('distinctiveServices');
let DservicesChoose = [];

Dservices.addEventListener('change', function() {
    // console.log(citys.value);
    if (Dservices.value !== "more") {
        if (!DservicesChoose.includes(Dservices.value)) {
            DservicesChoose.push(Dservices.value.replace("-", " "));
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('service');
            choose.innerHTML = Dservices.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
            choose.id = Dservices.value.replace("-", " ");
            choose.onclick = function() {
                deleteItemDServices(choose.id);
            }
            document.getElementById('Dservices').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!DservicesChoose.includes(newCity)) {
                DservicesChoose.push(newCity.replace("-", " "));
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('service');
                choose.innerHTML = newCity.replace("-", " ") + "<span style = 'color: white;'>X</span>";
                choose.id = newCity.replace("-", " ");
                choose.onclick = function() {
                    deleteItemDServices(choose.id);
                }
                document.getElementById('Dservices').appendChild(choose);
            }
        }
    }
})

function deleteItemDServices(value) {
    let PDservices = document.getElementById(value);
    // console.log(value);

    const index = DservicesChoose.indexOf(value);
    if (index > -1) {
        DservicesChoose.splice(index, 1);
    }

    if (PDservices) {
        PDservices.remove();
    }

    if (DservicesChoose.length == 0) {
        document.getElementById("distinctiveServices").value = "";
    }
}

let managedMedia = document.getElementById('managedMedia');
let MMediaChoose = [];

managedMedia.addEventListener('change', function() {
    // console.log(citys.value);
    if (!MMediaChoose.includes(managedMedia.value)) {
        MMediaChoose.push(managedMedia.value.replace("-", " "));
        // console.log(cityChoose);
        let choose = document.createElement('div');
        choose.classList.add('Mmedia');
        choose.innerHTML = managedMedia.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
        choose.id = managedMedia.value.replace("-", " ");
        choose.onclick = function() {
            deleteItemManMedia(choose.id);
        }
        document.getElementById('ManMedia').appendChild(choose);
    }
})

function deleteItemManMedia(value) {
    let manMedia = document.getElementById(value);
    // console.log(value);

    const index = MMediaChoose.indexOf(value);
    if (index > -1) {
        MMediaChoose.splice(index, 1);
    }

    if (manMedia) {
        manMedia.remove();
    }

    if (MMediaChoose.length == 0) {
        document.getElementById("managedMedia").value = "";
    }
}

let managedPlatfrom = document.getElementById('managedPlatform');
let MPlatformChoose = [];

managedPlatfrom.addEventListener('change', function() {
    // console.log(citys.value);
    if (managedPlatfrom.value !== "more") {
        if (!MPlatformChoose.includes(managedPlatfrom.value)) {
            MPlatformChoose.push(managedPlatfrom.value.replace("-", " "));
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('Mmedia');
            choose.innerHTML = managedPlatfrom.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
            choose.id = managedPlatfrom.value.replace("-", " ");
            choose.onclick = function() {
                deleteItemManPlatform(choose.id);
            }
            document.getElementById('ManPlatform').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!MPlatformChoose.includes(newCity)) {
                MPlatformChoose.push(newCity.replace("-", " "));
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('Mmedia');
                choose.innerHTML = newCity.replace("-", " ") + "<span style = 'color: white;'>X</span>";
                choose.id = newCity.replace("-", " ");
                choose.onclick = function() {
                    deleteItemManPlatform(choose.id);
                }
                document.getElementById('ManPlatform').appendChild(choose);
            }
        }
    }
})

function deleteItemManPlatform(value) {
    let manPlatform = document.getElementById(value);
    // console.log(value);

    const index = MPlatformChoose.indexOf(value);
    if (index > -1) {
        MPlatformChoose.splice(index, 1);
    }

    if (manPlatform) {
        manPlatform.remove();
    }

    if (MPlatformChoose.length == 0) {
        document.getElementById("managedPlatform").value = "";
    }
}

function validateFormStep(stepNumber) {
    let stepValid = true;

    document.querySelectorAll(`#form-step-${stepNumber} input, #form-step-${stepNumber} select`).forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            stepValid = false;
        }
    });
    return stepValid;
}

function secondStep() {
    if (validateFormStep(1)) {
        document.getElementById('form-1-an').style.marginRight = -600 + "%";
        document.getElementById('form-1').style.height = 0 + "%";
        setTimeout(function() {document.getElementById('form-2-an').style.marginRight = 0 + "%"; document.getElementById('form-2').style.height = "auto";}, 150);
    }
}

function thirdStep() {
    if (validateFormStep(2)) {
        document.getElementById('form-2-an').style.marginRight = -600 + "%";
        document.getElementById('form-2').style.height = 0 + "%";
        setTimeout(function() {document.getElementById('form-3-an').style.marginRight = 0 + "%"; document.getElementById('form-3').style.height = "auto";}, 150);
    }
}

function fourthStep() {
    if (validateFormStep(3)) {
        document.getElementById('form-3-an').style.marginRight = -600 + "%";
        document.getElementById('form-3').style.height = 0 + "%";
        setTimeout(function() {document.getElementById('form-4-an').style.marginRight = 0 + "%"; document.getElementById('form-4').style.height = "auto";}, 150);
    }
}

function fiveStep() {
    if (validateFormStep(4)) {
        document.getElementById('form-4-an').style.marginRight = -600 + "%";
        document.getElementById('form-4').style.height = 0 + "%";
        setTimeout(function() {document.getElementById('form-5-an').style.marginRight = 0 + "%"; document.getElementById('form-5').style.height = "auto";}, 150);
    }
}

function sixStep() {
    if (validateFormStep(5)) {
        if (referralClient.length > 0) {
            document.getElementById('form-5-an').style.marginRight = -600 + "%";
            document.getElementById('form-5').style.height = 0 + "%";
            setTimeout(function() {document.getElementById('form-6-an').style.marginRight = 0 + "%"; document.getElementById('form-6').style.height = "auto";}, 150);
            document.getElementById("selectedCitysFinal").value = cityChoose.join(",");
            document.getElementById("mainServicesFinal").value = servicesChoose.join(",");
            document.getElementById("distinctiveServiceFinal").value = DservicesChoose.join(",");
            document.getElementById("managedMediaFinal").value = MMediaChoose.join(",");
            document.getElementById("managedPlatformFinal").value = MPlatformChoose.join(",");
            document.getElementById("referralClientFinal").value = referralClient.join(",");
        } else {
            alert("Enter at least one referral client");
        }
    }
}

function verify() {
    if (document.getElementById("mainClient").files.length > 3) {
        alert("You can only choose 3 main client");
        return false;
    } else if (document.getElementById("mainClient").files.length < 3) {
        alert("You have to choose min 3 main client");
        return false;
    } else {
        return true;
    }
}


function returnFirst() {
    document.getElementById('form-2-an').style.marginRight = 600 + "%";
    document.getElementById('form-2').style.height =  0 + "%";
    setTimeout(function() {document.getElementById('form-1-an').style.marginRight = 0 + "%"; document.getElementById('form-1').style.height = "auto";}, 150);
}

function returnSecond() {
    document.getElementById('form-3-an').style.marginRight = 600 + "%";
    document.getElementById('form-3').style.height =  0 + "%";
    setTimeout(function() {document.getElementById('form-2-an').style.marginRight = 0 + "%"; document.getElementById('form-2').style.height = "auto";}, 150);
}

function returnThird() {
    document.getElementById('form-4-an').style.marginRight = 600 + "%";
    document.getElementById('form-4').style.height =  0 + "%";
    setTimeout(function() {document.getElementById('form-3-an').style.marginRight = 0 + "%"; document.getElementById('form-3').style.height = "auto";}, 150);
}

function returnFourth() {
    document.getElementById('form-5-an').style.marginRight = 600 + "%";
    document.getElementById('form-5').style.height =  0 + "%";
    setTimeout(function() {document.getElementById('form-4-an').style.marginRight = 0 + "%"; document.getElementById('form-4').style.height = "auto";}, 150);
}

function returnFive() {
    document.getElementById('form-6-an').style.marginRight = 600 + "%";
    document.getElementById('form-6').style.height =  0 + "%";
    setTimeout(function() {document.getElementById('form-5-an').style.marginRight = 0 + "%"; document.getElementById('form-5').style.height = "auto";}, 150);
}

let x = -1;

document.getElementById('select-awac').addEventListener('click', function() {
    x = x * -1;
    let display = document.getElementById('container-awac');
    let scritta = document.getElementById('select-awac');

    if (x == 1) {
        display.style.maxHeight = "200px";
        display.style.padding = "10px";
        scritta.innerHTML = "Close the menu ↑";
        scritta.style.borderColor = "#0097b2";
        scritta.style.color = "#424242";
    } else {
        display.style.maxHeight = "0px";
        display.style.padding = "0px";
        scritta.innerHTML = "Open the menu ↓";
        scritta.style.borderColor = "#e7e7e7";
        scritta.style.color = "#adadad";
    }
})