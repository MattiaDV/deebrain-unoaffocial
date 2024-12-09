let primaEdit = document.getElementById('prima-edit');
let secondaEdit = document.getElementById('seconda-edit');
let terzaEdit = document.getElementById('terza-edit');
let quartaEdit = document.getElementById('quarta-edit');
let quintaEdit = document.getElementById('quinta-edit');
let sestaEdit = document.getElementById('sesta-edit');
let settimaEdit = document.getElementById('settima-edit');

let accountInfo = document.getElementById("profileInfo");
let contactInfo = document.getElementById("contactInfos");
let servicesInfo = document.getElementById('servicesInfo');
let managedInfo = document.getElementById('managedInfo');
let clientsInfo = document.getElementById('clientsInfo');
let bandC = document.getElementById('bandcInfo');
let tools = document.getElementById('tools');

let menuParts = [accountInfo, contactInfo, servicesInfo, managedInfo, clientsInfo, bandC, tools];
let editPart = [primaEdit, secondaEdit, terzaEdit, quartaEdit, quintaEdit, sestaEdit, settimaEdit];
let parts = document.getElementsByClassName('pagina');

for (let part of parts) {
    part.style.display = (part.id == primaEdit.id) ? "block" : "none";
}

function handleMenuClick(clickedMenu, editId) {
    for (let part of parts) {
        part.style.display = (part.id === editId) ? "block" : "none";
    }

    for (let menu of menuParts) {
        if (menu.id === clickedMenu.id) {
            menu.classList.add("active");
        }  else {
            menu.classList.remove("active");
        }
    }
}

for (let x = 0; x < menuParts.length; x++) {
    console.log(menuParts[x]);
    menuParts[x].addEventListener('click', function() {
        handleMenuClick(menuParts[x], editPart[x].id);
    })
}


let newLogo = document.getElementById('newLogo');

newLogo.addEventListener('change', function() {
    let file = newLogo.files[0];
    if (file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            let logoNew = document.getElementById('logoNew');
            logoNew.innerHTML = '<span class = "fs-14 light-text">Upload new logo</span>';
            logoNew.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});




let citys = document.getElementById('location');
let cityChoose = [];
let inputCity = document.getElementById('locationChanges');

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
            inputCity.value = cityChoose;
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
                inputCity.value = cityChoose;
            }
        }
    }
})

function deleteItem(value) {
    let city = document.getElementById(value);
    // console.log(value);

    const index = cityChoose.indexOf(value.toLowerCase());
    if (index > -1) {
        cityChoose.splice(index, 1);
    }

    if (city) {
        city.remove();
    }

    if (cityChoose.length == 0) {
        document.getElementById("location").value = "";
    }
    inputCity.value = cityChoose;
}


let services = document.getElementById('mainServices');
let servicesChoose = [];
let mainServiceInput = document.getElementById('mainServiceFinal');

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
        mainServiceInput.value = servicesChoose;
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
    mainServiceInput.value = servicesChoose;
}



let Dservices = document.getElementById('distinctiveServices');
let DservicesChoose = [];
let distinctiveServiceInput = document.getElementById('distinctiveServiceFinal');

Dservices.addEventListener('change', function() {
    // console.log(citys.value);
    if (Dservices.value !== "more") {
        if (!DservicesChoose.includes(Dservices.value)) {
            DservicesChoose.push(Dservices.value.replace("-", " "));
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('serviceD');
            choose.innerHTML = Dservices.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
            choose.id = Dservices.value.replace("-", " ");
            choose.onclick = function() {
                deleteItemDServices(choose.id);
            }
            document.getElementById('Dservices').appendChild(choose);
            distinctiveServiceInput.value = DservicesChoose;
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
                distinctiveServiceInput.value = DservicesChoose;
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
    distinctiveServiceInput.value = DservicesChoose;
}

let managedMedia = document.getElementById('managedMedia');
let MMediaChoose = [];
let mMediaInput = document.getElementById('mMediaIn');

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
        mMediaInput.value = MMediaChoose;
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
    mMediaInput.value = MMediaChoose;
}

let managedPlatfrom = document.getElementById('managedPlatform');
let MPlatformChoose = [];
let mPlatIn = document.getElementById('mPlatformIn');

managedPlatfrom.addEventListener('change', function() {
    // console.log(citys.value);
    if (managedPlatfrom.value !== "more") {
        if (!MPlatformChoose.includes(managedPlatfrom.value)) {
            MPlatformChoose.push(managedPlatfrom.value.replace("-", " "));
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('Mplatformm');
            choose.innerHTML = managedPlatfrom.value.replace("-", " ") + "<span style = 'color: white;'>X</span>";
            choose.id = managedPlatfrom.value.replace("-", " ");
            choose.onclick = function() {
                deleteItemManPlatform(choose.id);
            }
            document.getElementById('ManPlatform').appendChild(choose);
            mPlatIn.value = MPlatformChoose;
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
                mPlatIn.value = MPlatformChoose;
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
    mPlatIn.value = MPlatformChoose;
}

let referralClient = [];
let idd = -1;
let iddd = 0;

function addReferral() {
    let nameAndSurname = document.getElementById("nameAndSurname").value;
    let profession = document.getElementById("profession").value;
    let photo = document.getElementById("photo").files[0];
    let mainClientRef = document.getElementById("mainClient").value;

    if (nameAndSurname !== "" && profession !== "" && photo !== undefined && mainClientRef !== "") {
        referralClient.push()
        return true;
    } else {
        alert("Please fill all fields.");
        return false;
    }
}


function removeClient(value) {
    // let index = referralClient.findIndex(client => client.idd === parseFloat(value));
    // referralClient.splice(index, 1);
    document.getElementById(value).remove();
}



let mainClientLogod = [];

function photoLoad(disp, photo) {
    let dis = document.getElementById(disp);
    let pho = document.getElementById(photo).files[0];

    if (pho) {
        let reader = new FileReader();

        reader.onload = function(e) {
            let img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'New Logo';
            img.id = dis + "-photo";
            dis.appendChild(img);
        }

        mainClientLogod.push('1');
        reader.readAsDataURL(pho);
    }

    let p = document.getElementById(disp).getElementsByTagName('label');
    p[0].style.display = "none";
}

function unlaodPhoto(disp) {
    let img = document.getElementById(disp).getElementsByTagName('img')[0];
    let label = document.getElementById(disp).getElementsByTagName('label')[0];
    let inputs = document.getElementById(disp).getElementsByTagName('input')[0];

    img.remove();
    inputs.value = "";
    label.style.display = "block";

    mainClientLogod.pop();
}




function cityPush() {
    // citys
    let citysCho = document.querySelectorAll('.city');
    for (let elem of citysCho) {
        cityChoose.push(elem.id.replace("-", " "));
        inputCity.value = cityChoose;
    }

    // serviceChoose
    let servicesCho = document.querySelectorAll('.service');
    for (let elem of servicesCho) {
        servicesChoose.push(elem.id.replace("-", " "));
        mainServiceInput.value = servicesChoose;
    }

    // serviceDissCho
    let serviceDissCho = document.querySelectorAll('.serviceD');
    for (let elem of serviceDissCho) {
        DservicesChoose.push(elem.id.replace("-", " "));
        distinctiveServiceInput.value = DservicesChoose;
    }

    // MMediaChoose
    let managedMediaServ = document.querySelectorAll('.Mmedia');
    for (let elem of managedMediaServ) {
        MMediaChoose.push(elem.id.replace("-", " "));
        mMediaInput.value = MMediaChoose;
    }

    // MPlatformChoose
    let managedPlatformA = document.querySelectorAll('.Mplatformm');
    for (let elem of managedPlatformA) {
        MPlatformChoose.push(elem.id.replace("-", " "));
        mPlatIn.value = MPlatformChoose;
    }

    // referralClient
    let refClientA = document.querySelectorAll('.refC');
    let nameAndSurname = document.querySelectorAll('.nSurn');
    let profession = document.querySelectorAll('.workas');
    let photo = document.querySelectorAll('.imga');
    let mainClientRef = document.querySelectorAll('.workWhere');
    let user;
    for (let elem = 0; elem < refClientA.length; elem++) {
        user = {
            idd: refClientA[elem].id,
            nameAndSurname: nameAndSurname[elem]?.textContent || "",
            profession: profession[elem]?.textContent || "",
            photo: photo[elem]?.src || "", 
            mainClientRef: mainClientRef[elem]?.textContent || "" 
        }
        referralClient.push(user);
    }

    // mainClientLogod
    let mainClient = document.querySelectorAll('.main-client > img');
    for (let mainC of mainClient) {
        mainClientLogod.push("1");
    }
}

function ref() {
    if (mainClientLogod.length < 3) {
        alert("Set minimum 3 referral client");
        return false;
    } else {
        return true;
    }
}