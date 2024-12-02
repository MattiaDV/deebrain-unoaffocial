let primaEdit = document.getElementById('prima-edit');
let secondaEdit = document.getElementById('seconda-edit');
let terzaEdit = document.getElementById('terza-edit');
let quartaEdit = document.getElementById('quarta-edit');
let quintaEdit = document.getElementById('quinta-edit');
let sestaEdit = document.getElementById('sesta-edit');

let accountInfo = document.getElementById("profileInfo");
let contactInfo = document.getElementById("contactInfos");
let servicesInfo = document.getElementById('servicesInfo');
let managedInfo = document.getElementById('managedInfo');
let clientsInfo = document.getElementById('clientsInfo');
let bandC = document.getElementById('bandcInfo');

let menuParts = [accountInfo, contactInfo, servicesInfo, managedInfo, clientsInfo, bandC];
let editPart = [primaEdit, secondaEdit, terzaEdit, quartaEdit, quintaEdit, sestaEdit];
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

function cityPush() {
    let citysCho = document.querySelectorAll('.city');
    for (let elem of citysCho) {
        cityChoose.push(elem.id.toLowerCase());
    }
}

citys.addEventListener('change', function() {
    // console.log(citys.value);
    console.log(citys.value);
    if (citys.value !== "more") {
        if (!cityChoose.includes(citys.value)) {
            cityChoose.push(citys.value);
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('city');
            choose.innerHTML = citys.value + "<span style = 'color: white;'>X</span>";
            choose.id = citys.value;
            choose.onclick = function() {
                deleteItem(choose.id);
            }
            document.getElementById('citys').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!cityChoose.includes(newCity)) {
                cityChoose.push(newCity);
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('city');
                choose.innerHTML = newCity + "<span style = 'color: white;'>X</span>";
                choose.id = newCity;
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
        servicesChoose.push(services.value);
        // console.log(cityChoose);
        let choose = document.createElement('div');
        choose.classList.add('service');
        choose.innerHTML = services.value + "<span style = 'color: white;'>X</span>";
        choose.id = services.value;
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
            DservicesChoose.push(Dservices.value);
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('service');
            choose.innerHTML = Dservices.value + "<span style = 'color: white;'>X</span>";
            choose.id = Dservices.value;
            choose.onclick = function() {
                deleteItemDServices(choose.id);
            }
            document.getElementById('Dservices').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!DservicesChoose.includes(newCity)) {
                DservicesChoose.push(newCity);
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('service');
                choose.innerHTML = newCity + "<span style = 'color: white;'>X</span>";
                choose.id = newCity;
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
        MMediaChoose.push(managedMedia.value);
        // console.log(cityChoose);
        let choose = document.createElement('div');
        choose.classList.add('Mmedia');
        choose.innerHTML = managedMedia.value + "<span style = 'color: white;'>X</span>";
        choose.id = managedMedia.value;
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
            MPlatformChoose.push(managedPlatfrom.value);
            // console.log(cityChoose);
            let choose = document.createElement('div');
            choose.classList.add('Mmedia');
            choose.innerHTML = managedPlatfrom.value + "<span style = 'color: white;'>X</span>";
            choose.id = managedPlatfrom.value;
            choose.onclick = function() {
                deleteItemManPlatform(choose.id);
            }
            document.getElementById('ManPlatform').appendChild(choose);
        }
    } else {
        let newCity = prompt("Insert here other (If you click for error just click enter): ");
        if (newCity !== "") {
            if (!MPlatformChoose.includes(newCity)) {
                MPlatformChoose.push(newCity);
                // console.log(cityChoose);
                let choose = document.createElement('div');
                choose.classList.add('Mmedia');
                choose.innerHTML = newCity + "<span style = 'color: white;'>X</span>";
                choose.id = newCity;
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

let referralClient = [];
let idd = -1;
let iddd = 0;

function addReferral() {
    let nameAndSurname = document.getElementById("nameAndSurname").value;
    let profession = document.getElementById("profession").value;
    let photo = document.getElementById("photo").files[0];
    let mainClientRef = document.getElementById("mainClient").value;

    if (nameAndSurname !== "" && profession !== "" && photo !== undefined && mainClientRef !== "") {
        referralClient.push({
            id : iddd,
            nameAndSurname: nameAndSurname,
            profession: profession,
            photo: photo,
            mainClientRef: mainClientRef
        });

        if (photo) {
            let reader = new FileReader();

            reader.onload = function(e) {
                let logoNew = document.getElementById('table-ref');
                let row = document.createElement('tr');
                row.id = idd;
                row.className = "newAdd";

                let nameTd = document.createElement('td');
                nameTd.textContent = nameAndSurname;
                row.appendChild(nameTd);

                let professionTd = document.createElement('td');
                professionTd.textContent = profession;
                row.appendChild(professionTd);

                let photoTd = document.createElement('td');
                let img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'New Logo';
                photoTd.appendChild(img);
                row.appendChild(photoTd);

                let mainClientRefTd = document.createElement('td');
                mainClientRefTd.textContent = mainClientRef;
                row.appendChild(mainClientRefTd);

                let deleteButtonTD = document.createElement('td');
                let buttonDel = document.createElement('input');
                buttonDel.type = "button";
                buttonDel.classList = "remove-ref";
                buttonDel.onclick = function() {
                    removeClient(row.id);
                };
                buttonDel.value = "-";
                deleteButtonTD.appendChild(buttonDel);
                row.appendChild(deleteButtonTD);

                logoNew.appendChild(row);
            };

            reader.readAsDataURL(photo);
        }

        idd++;
        iddd++;

    } else {
        alert("Please fill all fields.");
    }
}


function removeClient(value) {
    // let index = referralClient.findIndex(client => client.id === parseFloat(value));
    // referralClient.splice(index, 1);
    document.getElementById(value).remove();
}




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
}