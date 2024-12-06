import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, read } from 'node:fs';
import { extname, join } from 'node:path';
import cookie from 'cookie';
import formidable from 'formidable';
import dbLayer from './dbLayer.js';
import fs from 'fs';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
    const { method, url } = req;

    // Gestione della homepage
    if (method === 'GET' && url === '/') {
        try {
            let htmlContent = await readFile('index.html', 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    } 
    
    if (method === 'GET' && url === '/register.html') {
        try {
            let htmlContent = await readFile('register.html', 'utf8');
            let id_array_location = Array.from({ length: 440 }, (_, i) => i);
            let locationAll = await dbLayer.getLocationsFromDb(id_array_location);
            let mainServ = await dbLayer.getMainFromDb(id_array_location);
            let disServ = await dbLayer.getDisFromDb(id_array_location);
            let media = await dbLayer.getMediaFromDb(id_array_location);
            let platform = await dbLayer.getPlatformFromDb(id_array_location);
            let updatedHtmlContent = htmlContent.replace("{locations}", locationAll.join(''));
            let up = updatedHtmlContent.replace('{mainService}', mainServ);
            let upp = up.replace('{distinctiveService}', disServ);
            let uppp = upp.replace('{media}', media);
            let upppp = uppp.replace('{platform}', platform);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(upppp);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    if (method === 'POST' && url === '/home.html') {
        try {
            let form = formidable({ multiples: true }); 
            let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
    
            form.parse(req, async (err, fields, files) => {
                try {
                    if (err) {
                        console.error("Errore durante il parsing del form:", err);
                        if (!res.headersSent) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Errore durante il parsing del form');
                        }
                        return;
                    }

                    // console.log(founderNameCommands)
                    let founderNames = fields.founderName
                        .flatMap(name => name.split(',').map(part => part.trim()));
                    // console.log("Tipo di founderName:", typeof founderNames);
                    // console.log("Valore di founderName:", founderNames);

                    let createF = await dbLayer.createFounderForDb(founderNames);
                    console.log("Separed founder: " + createF);
    
                    let citys = await dbLayer.getIdFounders(id_cardsAgency, founderNames);
                    console.log("ID FOUNDER/S: " + citys);

                    let resultLoc = [];
                    let resultMainS = [];
                    let resultDisS = [];
                    let resultMediS = [];
                    let resultPlatS = [];

                    if (fields.selectedCitysFinal) {
                        let finalLocation = fields.selectedCitysFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];
                    
                        let locationReal = locationsArray.map(part =>
                            part
                                .trim()
                                .split(/[\s\-]/)
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                                .join(' ')
                        );
                    
                        console.log("Città separate: ", locationReal);
                    
                        resultLoc = await dbLayer.searchIdOfLocationFromDb(id_cardsAgency, locationReal);
                        console.log(resultLoc);
                    }                    

                    if (fields.mainServicesFinal) {
                        let finalLocation = fields.mainServicesFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultMainS = await dbLayer.searchIdOfMainSFromDb(id_cardsAgency, locationsArray);
                        console.log(resultMainS);
                    }

                    if (fields.distinctiveServiceFinal) {
                        let finalLocation = fields.distinctiveServiceFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultDisS = await dbLayer.searchIdOfDisFromDb(id_cardsAgency, locationsArray);
                        console.log(resultDisS);
                    }

                    if (fields.managedMediaFinal) {
                        let finalLocation = fields.managedMediaFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultMediS = await dbLayer.searchIdOfMediaFromDb(id_cardsAgency, locationsArray);
                        console.log(resultMediS);
                    }

                    if (fields.managedPlatformFinal) {
                        let finalLocation = fields.managedPlatformFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultPlatS = await dbLayer.searchIdOfPlatformFromDb(id_cardsAgency, locationsArray);
                        console.log(resultPlatS);
                    }

                    let filePath = files.agencyLogo[0].filepath;
                    let fileBuffer = fs.readFileSync(filePath);
                    let fileBase64 = fileBuffer.toString('base64');
    
                    // console.log(JSON.stringify(files));
    
                    let user = {
                        name: fields.agencyName?.[0] || null,
                        founderName: citys,
                        numberOfEmployees: fields.numberOfEmployees?.[0] || null,
                        foundationYear: fields.foundationYear?.[0] || null,
                        agencyType: fields.agencyType?.[0] || null,
                        logo: fileBase64,
                        managedBilling: fields.managedBilling?.[0] || null,
                        awareness: fields.awareness?.[0] === 'on',
                        conversion: fields.conversion?.[0] === 'on',
                        website: fields.agencyWebsite?.[0] || null,
                        linkedinLink: fields.agencyLinkedin?.[0] || null,
                        facebookLink: fields.agencyFacebook?.[0] || null,
                        email: fields.agencyEmail?.[0] || null,
                        locations: resultLoc,
                        mainServices: resultMainS,
                        distinctiveServices: resultDisS,
                        managedMedia: resultMediS,
                        managedPlatform: resultPlatS,
                        // Per ora concentriamoci sui precedenti
                        // referralClient: await searchIdOfReferralFromDb(id_cardsAgency, fields.nameAndSurnameRef),
                        brochure: fields.brochure?.[0] || null,
                        caseStudy: fields.caseStudy?.[0] || null,
                        // clientLogos: files.mainClient || [], 
                    };
    
                    // console.log("Utente da creare:", JSON.stringify(user, null, 2));
    
                    let result = await dbLayer.createUser(user);
                    console.log("Utente creato:", result);

                    res.writeHead(302, { 'Location': '/listing.html' });
    
                } catch (createUserError) {
                    console.error("Errore durante la creazione dell'utente:", createUserError);
                    if (!res.headersSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Errore durante la creazione dell\'utente');
                    }
                }
            });
        } catch (err) {
            console.error('Errore nel server:', err);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Errore del server interno');
            }
        }
    }    
    
    
        

    if (method === 'GET' && url === '/listing.html') {
        try {
            let htmlContent = await readFile('listing.html', 'utf8');
            let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            let cardsAgency = await dbLayer.getNewAgencyFromDB(id_cardsAgency);
            let location = await dbLayer.getLocationsFromDb(id_cardsAgency);
            let mainS = await dbLayer.getNormalMainFromDb(id_cardsAgency);
            let disS = await dbLayer.getNormalDisFromDb(id_cardsAgency);
            let mediaM = await dbLayer.getNormalMediaFromDb(id_cardsAgency);
            let platformM = await dbLayer.getNormalPlatformFromDb(id_cardsAgency);
            let agencyTypes = await dbLayer.getAgencyTypeFromDB(id_cardsAgency);
            let normalLocation = await dbLayer.getNormalLocationsFromDb(id_cardsAgency);
            let updatedHtmlContent = htmlContent.replace("{cards}", cardsAgency.join(''));
            let filterAgencyType = updatedHtmlContent.replace("{filter-agencyType}", agencyTypes.join(''));
            let filterLocation = filterAgencyType.replace("{filter-location}", normalLocation.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            let filterMains = filterLocation.replace("{filter-mainService}", mainS.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            let filterDis = filterMains.replace("{filter-distinctiveService}", disS.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked> <option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            let filterMedia = filterDis.replace("{filter-managedMedia}", mediaM.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked> <option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            let filterPlatform = filterMedia.replace("{filter-managedPlatform}", platformM.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(filterPlatform);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    if (method === 'GET' && url === '/mypage.html') {
        try {
            let htmlContent = await readFile('mypage.html', 'utf8');
            let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            let cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
            let emailFromCookie = cookies.email || 'Nessun cookie trovato';
            let nameOfAgency = await dbLayer.getAllDataFromDB(id_cardsAgency);
            let founderNames = await dbLayer.getFounderNamesFromDB(id_cardsAgency);
            let locationName = await dbLayer.getNormalLocationsFromDb(id_cardsAgency);
            let updatedHtmlContent = htmlContent;
            let mainServiceLoad = await dbLayer.getNormalMainFromDb(id_cardsAgency);
            let distinctiveServiceLoad = await dbLayer.getNormalDisFromDb(id_cardsAgency);
            let managedMediaLoad = await dbLayer.getNormalMediaFromDb(id_cardsAgency);
            let managedPlatformLoad = await dbLayer.getNormalPlatformFromDb(id_cardsAgency);
            let mainClientLoad = await dbLayer.getNormalMainClientFromDb(id_cardsAgency);
            let referralClientLoad = await dbLayer.getNormalReferralClientFromDb(id_cardsAgency);

            let idFounder = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.founderName)

            let idLocation= nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.locations)

            let idMainServ = nameOfAgency 
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.mainServices)

            let idDisServ = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.distinctiveServices)

            let idMedia = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedMedia)

            let idPlatform = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedPlatform)

            let idMainClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.clientLogos)

            let idReferralClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.referralClient)

            // console.log(idLocation);
            // console.log(idFounder);

            let idFounderFlat = idFounder.flat();
            let idLocationFlat = idLocation.flat();
            let idMainServFlat = idMainServ.flat();
            let idDisServFlat = idDisServ.flat();
            let idMediaFlat = idMedia.flat();
            let idPlatformFlat = idPlatform.flat();
            let idMainClientFlat = idMainClient.flat();
            let idRefCliFlat = idReferralClient.flat();

            // console.log(idLocationFlat);

            let realName = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)

            let realFounder = founderNames
                .filter(partner => idFounderFlat.includes(partner.id))
                .map(partner => partner.name)

            let realLocation = locationName
                .filter(partner => idLocationFlat.includes(partner.id))
                .map(partner => partner.name)

            let realMainServ = mainServiceLoad
                .filter(partner => idMainServFlat.includes(partner.id))
                .map(partner => partner.name)

            let realDisServ = distinctiveServiceLoad
                .filter(partner => idDisServFlat.includes(partner.id))
                .map(partner => partner)

            let realMedia = managedMediaLoad
                .filter(partner => idMediaFlat.includes(partner.id))
                .map(partner => partner.name)

            let realPlatform = managedPlatformLoad
                .filter(partner => idPlatformFlat.includes(partner.id))
                .map(partner => partner.name)
            
            let realMainClient = mainClientLoad
                .filter(partner => idMainClientFlat.includes(partner.id))
                .map(partner => partner)

            let realReferralClient = referralClientLoad
                .filter(partner => idRefCliFlat.includes(partner.id))
                .map(partner => partner)

            // console.log(realLocation);

            // console.log(realFounder);

            let realNames = updatedHtmlContent.replace('{agencyName}', realName.map(partner => partner.name));
            let realNamesURL = realNames.replace('{agencyNameURL}', realName.map(partner => partner.name));
            let yearsF = realNamesURL.replace('{yearOfFoundation}', realName.map(partner => partner.foundationYear));
            let customers = yearsF.replace('{customers}', realName.map(partner => partner.founderName.length));
            let foun = customers.replace('{founder}', realFounder.join(', '));
            let agencyTTT = foun.replace('{agencyTypePersonal}', realName.map(partner => partner.agencyType.replace('-', ' ').toUpperCase()));
            let bill = agencyTTT.replace('{billingPersonal}', realName.map(partner => (partner.managedBilling > 999999) ? (partner.managedBilling / 1000000) + "M" : (partner.managedBilling > 9999) ? (partner.managedBilling / 1000) + "k" : partner.managedBilling));
            let location = bill.replace('{locationPersonal}', realLocation.join(', '));
            let emploPers = location.replace('{employeesPersonalQuad}', realName.map(partner => partner.numberOfEmployees));
            let awareness = emploPers.replace('{awareness}', realName.map(partner => (partner.awareness == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Awareness</span>" : ''));
            let conversion = awareness.replace('{conversion}', realName.map(partner => (partner.conversion == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Conversion</span>" : ''));
            let consideration = conversion.replace('{consideration}', realName.map(partner => (partner.consideration == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Consideration</span>" : ''));
            let urlSito = consideration.replace('{urlSito}', realName.map(partner => partner.website));
            let urlLinkedin = urlSito.replace('{urlLinkedin}', realName.map(partner => partner.linkedinLink));
            let urlFacebook = urlLinkedin.replace('{urlFacebool}', realName.map(partner => partner.facebookLink));
            let emailContact = urlFacebook.replace('{emailContact}', realName.map(partner => partner.email));
            let titlePage = emailContact.replace('{titleName}', realName.map(partner => partner.name));
            let baseUrl = "http://127.0.0.1:8069/";
            let logoURL = titlePage.replace(
                '{logoUrl}',
                realName.map(partner =>
                    partner.logo 
                        ? `${baseUrl}/web/image/users_model/${partner.id}/logo`
                        : ''
                )
            );
            let mainServiceAdd = logoURL.replace('{mainServices}', realMainServ
                .map(partner => 
                    `<div class = "card-starter fs-18 normal-text">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V10Z" stroke="#000000" stroke-width="1.5"></path> <path d="M15 19H9" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.7484 2.37793L16.6643 2.5041C15.9082 3.63818 15.5302 4.20525 14.978 4.54836C14.8682 4.61658 14.7541 4.67764 14.6365 4.73115C14.0447 5.00025 13.3632 5.00025 12.0002 5.00025C10.6371 5.00025 9.95564 5.00025 9.36387 4.73115C9.2462 4.67764 9.13211 4.61658 9.02232 4.54836C8.47016 4.20524 8.09213 3.6382 7.33606 2.5041L7.25195 2.37793" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    <span class = "title-main-services-card">
                        ${partner}
                    </span>
                </div>`
                ).join('')
            )
            let distinctiveServiceAdd = mainServiceAdd.replace('{distinctiveServices}', realDisServ
                .map(partner => 
                    `<div class = "card-distinctive-listing">
                        <svg fill="#000000" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m19.828 6.612-5.52-5.535a3.135 3.135 0 0 0-4.5 0L4.273 6.612l7.755 3.87zm2.118 2.235 1.095 1.095a3.12 3.12 0 0 1 0 4.5L14.22 23.35a2.685 2.685 0 0 1-.72.525V13.077zm-19.893 0L.958 9.942a3.12 3.12 0 0 0 0 4.5L9.78 23.35c.21.214.453.392.72.525V13.077z"></path></g></svg>
                        <span class = "fs-18 normal-text distinctive-title">
                            ${partner.name}
                        </span>
                        <span class = "fs-16 light-text">
                            ${partner.description}
                        </span>
                    </div>`
                ).join('')
            )
            let mediaManaged = distinctiveServiceAdd.replace('{managedMedia}', realMedia
                .map(partner => 
                    `<div class = "card-container-gestiti">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 21L12 17L17 21M7.8 17H16.2C17.8802 17 18.7202 17 19.362 16.673C19.9265 16.3854 20.3854 15.9265 20.673 15.362C21 14.7202 21 13.8802 21 12.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V12.2C3 13.8802 3 14.7202 3.32698 15.362C3.6146 15.9265 4.07354 16.3854 4.63803 16.673C5.27976 17 6.11984 17 7.8 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span class = "fs-18 normal-text">
                            ${partner}
                        </span>
                    </div>`
                ).join('')
            )
            let managedPlatform = mediaManaged.replace('{platformManaged}', realPlatform
                .map(partner =>
                    `<div class = "card-platform-m">
                        <div class = "container-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                        </div>
                        <div class = "box-card-platform-managed">
                            <span class = "name-card fs-16 normal-text">
                                ${partner}
                            </span>
                            <div class = "box-words-platform-managed">
                                <span class = "certification fs-16 light-text">
                                    CERTIFICATED
                                </span>
                                <span class = "infos fs-16 light-text">
                                    ${partner}
                                </span>
                            </div>
                        </div>
                    </div>`
                ).join('')
            )
            let mainClient = managedPlatform.replace('{mainClients}', realMainClient
                .map(partner => 
                    `<div class = "main-card-client">
                        <h1>${partner.name}</h1>
                        <img src='${partner.logo 
                            ? `${baseUrl}/web/image/main_client_logos/${partner.id}/logo`
                            : ''}' alt = "mainClient logo">
                    </div>`
                ).join('')
            )
            let referralClient = mainClient.replace('{clientReferral}', realReferralClient
                .map(partner => 
                    `<div class = "card-client-ref">
                            <div class = "client-ref-img">
                                <img src = "${partner.photo 
                                    ? `${baseUrl}/web/image/users_referral_client/${partner.id}/photo`
                                    : ''}">
                            </div>
                            <span class = "name-client-refferal fs-18 normal-text">
                                ${partner.name} ${partner.surname}
                            </span>
                            <span class = "job-client-refferal fs-18 light-text">
                                <span class = "fs-16 light-text">${partner.workAs}</span>
                                <span class = "clientMain fs-16 light-text">${partner.workWhere}</span>
                            </span>
                        </div>`
                ).join('')
            )
            let brochure = referralClient.replace('{brochureURL}', realName.map(partner => partner.brochure).join(''));
            let caseStudy = brochure.replace('{caseStudyURL}', realName.map(partner => partner.caseStudy).join(''));
            let linkedinFooter = caseStudy.replace('{linkedinFooter}', realName.map(partner => partner.linkedinLink).join(''));
            let websiteFooter = linkedinFooter.replace('{websiteFooter}', realName.map(partner => partner.website).join(''));
            let planning = websiteFooter.replace("{planning}", realName.map(partner => partner.planning == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let project = planning.replace("{project}", realName.map(partner => partner.project == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let task = project.replace("{task}", realName.map(partner => partner.task == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let platform = task.replace("{platform}", realName.map(partner => partner.platform == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let reporting = platform.replace("{reporting}", realName.map(partner => partner.reporting == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let dataAnalysis = reporting.replace("{dataAnalysis}", realName.map(partner => partner.dataAnalysis == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let adServer = dataAnalysis.replace("{adServer}", realName.map(partner => partner.adServer == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let adVerification = adServer.replace("{adVerification}", realName.map(partner => partner.AdVerification == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            // console.log(nameOfAgency);
            // console.log(emailFromCookie)

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(adVerification);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    if (method === 'GET' && url === '/paginaD.html') {
        try {
            let htmlContent = await readFile('paginaD.html', 'utf8');
            let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            let cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
            let emailFromCookie = cookies.website || 'Nessun cookie trovato';
            let nameOfAgency = await dbLayer.getAllDataFromDB(id_cardsAgency);
            let founderNames = await dbLayer.getFounderNamesFromDB(id_cardsAgency);
            let locationName = await dbLayer.getNormalLocationsFromDb(id_cardsAgency);
            let updatedHtmlContent = htmlContent;
            let mainServiceLoad = await dbLayer.getNormalMainFromDb(id_cardsAgency);
            let distinctiveServiceLoad = await dbLayer.getNormalDisFromDb(id_cardsAgency);
            let managedMediaLoad = await dbLayer.getNormalMediaFromDb(id_cardsAgency);
            let managedPlatformLoad = await dbLayer.getNormalPlatformFromDb(id_cardsAgency);
            let mainClientLoad = await dbLayer.getNormalMainClientFromDb(id_cardsAgency);
            let referralClientLoad = await dbLayer.getNormalReferralClientFromDb(id_cardsAgency);

            let idFounder = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.founderName)

            let idLocation= nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.locations)

            let idMainServ = nameOfAgency 
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.mainServices)

            let idDisServ = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.distinctiveServices)

            let idMedia = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.managedMedia)

            let idPlatform = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.managedPlatform)

            let idMainClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.clientLogos)

            let idReferralClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)
                .map(partner => partner.referralClient)

            // console.log(idLocation);
            // console.log(idFounder);

            let idFounderFlat = idFounder.flat();
            let idLocationFlat = idLocation.flat();
            let idMainServFlat = idMainServ.flat();
            let idDisServFlat = idDisServ.flat();
            let idMediaFlat = idMedia.flat();
            let idPlatformFlat = idPlatform.flat();
            let idMainClientFlat = idMainClient.flat();
            let idRefCliFlat = idReferralClient.flat();

            // console.log(idLocationFlat);

            let realName = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.website == emailFromCookie)

            let realFounder = founderNames
                .filter(partner => idFounderFlat.includes(partner.id))
                .map(partner => partner.name)

            let realLocation = locationName
                .filter(partner => idLocationFlat.includes(partner.id))
                .map(partner => partner.name)

            let realMainServ = mainServiceLoad
                .filter(partner => idMainServFlat.includes(partner.id))
                .map(partner => partner.name)

            let realDisServ = distinctiveServiceLoad
                .filter(partner => idDisServFlat.includes(partner.id))
                .map(partner => partner)

            let realMedia = managedMediaLoad
                .filter(partner => idMediaFlat.includes(partner.id))
                .map(partner => partner.name)

            let realPlatform = managedPlatformLoad
                .filter(partner => idPlatformFlat.includes(partner.id))
                .map(partner => partner.name)
            
            let realMainClient = mainClientLoad
                .filter(partner => idMainClientFlat.includes(partner.id))
                .map(partner => partner)

            let realReferralClient = referralClientLoad
                .filter(partner => idRefCliFlat.includes(partner.id))
                .map(partner => partner)

            // console.log(realLocation);

            // console.log(realFounder);

            let realNames = updatedHtmlContent.replace('{agencyName}', realName.map(partner => partner.name));
            let realNamesURL = realNames.replace('{agencyNameURL}', realName.map(partner => partner.name));
            let yearsF = realNamesURL.replace('{yearOfFoundation}', realName.map(partner => partner.foundationYear));
            let customers = yearsF.replace('{customers}', realName.map(partner => partner.founderName.length));
            let foun = customers.replace('{founder}', realFounder.join(', '));
            let agencyTTT = foun.replace('{agencyTypePersonal}', realName.map(partner => partner.agencyType.replace('-', ' ').toUpperCase()));
            let bill = agencyTTT.replace('{billingPersonal}', realName.map(partner => (partner.managedBilling > 999999) ? (partner.managedBilling / 1000000) + "M" : (partner.managedBilling > 9999) ? (partner.managedBilling / 1000) + "k" : partner.managedBilling));
            let location = bill.replace('{locationPersonal}', realLocation.join(', '));
            let emploPers = location.replace('{employeesPersonalQuad}', realName.map(partner => partner.numberOfEmployees));
            let awareness = emploPers.replace('{awareness}', realName.map(partner => (partner.awareness == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Awareness</span>" : ''));
            let conversion = awareness.replace('{conversion}', realName.map(partner => (partner.conversion == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Conversion</span>" : ''));
            let consideration = conversion.replace('{consideration}', realName.map(partner => (partner.consideration == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Consideration</span>" : ''));
            let urlSito = consideration.replace('{urlSito}', realName.map(partner => partner.website));
            let urlLinkedin = urlSito.replace('{urlLinkedin}', realName.map(partner => partner.linkedinLink));
            let urlFacebook = urlLinkedin.replace('{urlFacebool}', realName.map(partner => partner.facebookLink));
            let emailContact = urlFacebook.replace('{emailContact}', realName.map(partner => partner.email));
            let titlePage = emailContact.replace('{titleName}', realName.map(partner => partner.name));
            let baseUrl = "http://127.0.0.1:8069/";
            let logoURL = titlePage.replace(
                '{logoUrl}',
                realName.map(partner =>
                    partner.logo 
                        ? `${baseUrl}/web/image/users_model/${partner.id}/logo`
                        : ''
                )
            );
            let mainServiceAdd = logoURL.replace('{mainServices}', realMainServ
                .map(partner => 
                    `<div class = "card-starter fs-18 normal-text">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V10Z" stroke="#000000" stroke-width="1.5"></path> <path d="M15 19H9" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.7484 2.37793L16.6643 2.5041C15.9082 3.63818 15.5302 4.20525 14.978 4.54836C14.8682 4.61658 14.7541 4.67764 14.6365 4.73115C14.0447 5.00025 13.3632 5.00025 12.0002 5.00025C10.6371 5.00025 9.95564 5.00025 9.36387 4.73115C9.2462 4.67764 9.13211 4.61658 9.02232 4.54836C8.47016 4.20524 8.09213 3.6382 7.33606 2.5041L7.25195 2.37793" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    <span class = "title-main-services-card">
                        ${partner}
                    </span>
                </div>`
                ).join('')
            )
            let distinctiveServiceAdd = mainServiceAdd.replace('{distinctiveServices}', realDisServ
                .map(partner => 
                    `<div class = "card-distinctive-listing">
                        <svg fill="#000000" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m19.828 6.612-5.52-5.535a3.135 3.135 0 0 0-4.5 0L4.273 6.612l7.755 3.87zm2.118 2.235 1.095 1.095a3.12 3.12 0 0 1 0 4.5L14.22 23.35a2.685 2.685 0 0 1-.72.525V13.077zm-19.893 0L.958 9.942a3.12 3.12 0 0 0 0 4.5L9.78 23.35c.21.214.453.392.72.525V13.077z"></path></g></svg>
                        <span class = "fs-18 normal-text distinctive-title">
                            ${partner.name}
                        </span>
                        <span class = "fs-16 light-text">
                            ${partner.description}
                        </span>
                    </div>`
                ).join('')
            )
            let mediaManaged = distinctiveServiceAdd.replace('{managedMedia}', realMedia
                .map(partner => 
                    `<div class = "card-container-gestiti">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 21L12 17L17 21M7.8 17H16.2C17.8802 17 18.7202 17 19.362 16.673C19.9265 16.3854 20.3854 15.9265 20.673 15.362C21 14.7202 21 13.8802 21 12.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V12.2C3 13.8802 3 14.7202 3.32698 15.362C3.6146 15.9265 4.07354 16.3854 4.63803 16.673C5.27976 17 6.11984 17 7.8 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span class = "fs-18 normal-text">
                            ${partner}
                        </span>
                    </div>`
                ).join('')
            )
            let managedPlatform = mediaManaged.replace('{platformManaged}', realPlatform
                .map(partner =>
                    `<div class = "card-platform-m">
                        <div class = "container-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                        </div>
                        <div class = "box-card-platform-managed">
                            <span class = "name-card fs-16 normal-text">
                                ${partner}
                            </span>
                            <div class = "box-words-platform-managed">
                                <span class = "certification fs-16 light-text">
                                    CERTIFICATED
                                </span>
                                <span class = "infos fs-16 light-text">
                                    ${partner}
                                </span>
                            </div>
                        </div>
                    </div>`
                ).join('')
            )
            let mainClient = managedPlatform.replace('{mainClients}', realMainClient
                .map(partner => 
                    `<div class = "main-card-client">
                        <h1>${partner.name}</h1>
                        <img src='${partner.logo 
                            ? `${baseUrl}/web/image/main_client_logos/${partner.id}/logo`
                            : ''}' alt = "mainClient logo">
                    </div>`
                ).join('')
            )
            let referralClient = mainClient.replace('{clientReferral}', realReferralClient
                .map(partner => 
                    `<div class = "card-client-ref">
                            <div class = "client-ref-img">
                                <img src = "${partner.photo 
                                    ? `${baseUrl}/web/image/users_referral_client/${partner.id}/photo`
                                    : ''}">
                            </div>
                            <span class = "name-client-refferal fs-18 normal-text">
                                ${partner.name} ${partner.surname}
                            </span>
                            <span class = "job-client-refferal fs-18 light-text">
                                <span class = "fs-16 light-text">${partner.workAs}</span>
                                <span class = "clientMain fs-16 light-text">${partner.workWhere}</span>
                            </span>
                        </div>`
                ).join('')
            )
            let brochure = referralClient.replace('{brochureURL}', realName.map(partner => partner.brochure).join(''));
            let caseStudy = brochure.replace('{caseStudyURL}', realName.map(partner => partner.caseStudy).join(''));
            let linkedinFooter = caseStudy.replace('{linkedinFooter}', realName.map(partner => partner.linkedinLink).join(''));
            let websiteFooter = linkedinFooter.replace('{websiteFooter}', realName.map(partner => partner.website).join(''));
            let planning = websiteFooter.replace("{planning}", realName.map(partner => partner.planning == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let project = planning.replace("{project}", realName.map(partner => partner.project == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let task = project.replace("{task}", realName.map(partner => partner.task == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let platform = task.replace("{platform}", realName.map(partner => partner.platform == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let reporting = platform.replace("{reporting}", realName.map(partner => partner.reporting == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let dataAnalysis = reporting.replace("{dataAnalysis}", realName.map(partner => partner.dataAnalysis == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let adServer = dataAnalysis.replace("{adServer}", realName.map(partner => partner.adServer == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            let adVerification = adServer.replace("{adVerification}", realName.map(partner => partner.AdVerification == true ? `<span class = "active-innovation fs-12 light-text">Featured</span>` : `<span class = "inactive-innovation fs-12 light-text">No</span>`));
            // console.log(nameOfAgency);
            // console.log(emailFromCookie)

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(adVerification);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    if (method === 'GET' && url === '/edit.html') {
        let htmlContent = await readFile('edit.html', 'utf-8');
        let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
        let cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
        let emailFromCookie = cookies.email || 'Nessun cookie trovato';
        let getAgencyName = await dbLayer.getAllDataFromDB(id_cardsAgency);
        let nameOfAgency = await dbLayer.getAllDataFromDB(id_cardsAgency);
        let getReferralClient = await dbLayer.getAllReferralClientFromDb(id_cardsAgency);
        let getMainClient = await dbLayer.getNormalMainClientFromDb(id_cardsAgency);
        let getAllTypes = await dbLayer.getNormalAgencyTypeFromDB(id_cardsAgency);
        let getLocation = await dbLayer.getNormalLocationsFromDb(id_cardsAgency);
        let getMainService = await dbLayer.getNormalMainFromDb(id_cardsAgency);
        let getDisService = await dbLayer.getNormalDisFromDb(id_cardsAgency);
        let getManMedia = await dbLayer.getNormalMediaFromDb(id_cardsAgency);
        let getManPlatform = await dbLayer.getNormalPlatformFromDb(id_cardsAgency);
        let mainsC = await dbLayer.getMainFromDb(id_cardsAgency);
        let distsC = await dbLayer.getDisFromDb(id_cardsAgency);
        let mediaC = await dbLayer.getMediaFromDb(id_cardsAgency);
        let platC = await dbLayer.getPlatformFromDb(id_cardsAgency);

        try {

            let realName = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)

            let nameAgencyReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.name)

            let agencyTypeReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.agencyType)

            let managedBillingReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedBilling)

            let numberOfEmployeesReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.numberOfEmployees)

            let awareness = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.awareness)

            let conversion = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.conversion)

            let consideration = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.consideration)

            let websiteReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.website)

            let facebookReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.facebookLink)

            let linkedinReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.linkedinLink)

            let brochureReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.brochure)

            let caseStudyReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.caseStudy)

            let refClientReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.referralClient)

            let mainCliReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.clientLogos)

            let locationReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.locations)

            let mainServReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.mainServices)

            let distServReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.distinctiveServices)

            let manaMediaReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedMedia)

            let manaPlatformReal = getAgencyName
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedPlatform)

            let refClientFlat = refClientReal.flat()
            let mainCliFlat = mainCliReal.flat()
            let locationFlat = locationReal.flat()
            let mainServFlat = mainServReal.flat()
            let disServFlat = distServReal.flat()
            let manaMediaFlat = manaMediaReal.flat()
            let manaPlatformFlat = manaPlatformReal.flat()

            let agencyName = htmlContent.replace('{agencyName}', nameAgencyReal);
            let agencyType = agencyName.replace('{agencyType}', getAllTypes
                .map(partner =>
                    (partner.toLowerCase() == agencyTypeReal.toString().toLowerCase()) ? 
                    `<option value = "${partner.toLowerCase().replace(/ /g, "-")}" selected>${partner}</option>`
                    :
                    `<option value = "${partner.toLowerCase().replace(/ /g, "-")}">${partner}</option>`
                ).join(" ")
            );
            let managedBilling = agencyType.replace('{managedBilling}', managedBillingReal);
            let numberOfEmployees = managedBilling.replace('{nEmployee}', numberOfEmployeesReal);
            let aware = numberOfEmployees.replace('{awareness}', awareness.map(partner => (partner == true) ? `<input type = "checkbox" id = "awareness" name = "awareness" checked>` : `<input type = "checkbox" id = "awareness" name = "awareness">`));
            let conv = aware.replace('{conversion}', conversion.map(partner => (partner == true) ? `<input type = "checkbox" id = "conversion" name = "conversion" checked>` : `<input type = "checkbox" id = "conversion" name = "conversion">`));
            let cons = conv.replace('{consideration}', consideration.map(partner => (partner == true) ? `<input type = "checkbox" id = "consideration" name = "consideration" checked>` : `<input type = "checkbox" id = "consideration" name = "consideration">`));
            let website = cons.replace('{website}', websiteReal);
            let linkedin = website.replace('{linkedin}', linkedinReal.map(partner => (partner == false) ? '' : partner));
            let facebook = linkedin.replace('{facebook}', facebookReal.map(partner => (partner == false) ? '' : partner));
            let email = facebook.replace('{email}', emailFromCookie);
            let brochure = email.replace('{brochure}', brochureReal);
            let caseStudy = brochure.replace('{caseStudy}', caseStudyReal);
            let baseUrl = "http://127.0.0.1:8069/";
            let logoURL = caseStudy.replace(
                '{logo}',
                getAgencyName
                    .filter(partner => partner.email == emailFromCookie)
                    .map(partner =>
                        partner.logo 
                            ? `${baseUrl}/web/image/users_model/${partner.id}/logo`
                            : ''
                    )
            );
            let realReferralClient = logoURL.replace('{refClient}', 
                getReferralClient
                    .filter(partner => refClientFlat.includes(partner.id))
                    .map(partner => `<form method = "post"><tr class = 'refC' id = "${partner.id}"><td class = "nSurn">${partner.name}</td><td>${partner.surname}</td><td class = "workas">${partner.workAs}</td><td><img class = "imga" src="${baseUrl}/web/image/users_referral_client/${partner.id}/photo"></td><td class = "workWhere">${partner.workWhere}</td><td><input type = "submit" class = "remove-ref" value = "-""><input type = "hidden" value = "${partner.id}" name = "idDaTogliere"></td></tr></form>`).join(' ')
            )
            let mainClientLogo;
            if (mainCliFlat.length > 0) {
                mainClientLogo = realReferralClient.replace('{mainClient}', 
                    getMainClient
                        .filter(partner => mainCliFlat.includes(partner.id))
                        .map((partner, index) => `<div class = "main-card">
                                        <div class = "main-client" id = "main-client-${index}">
                                            <img src = "${baseUrl}/web/image/main_client_logos/${partner.id}/logo">
                                            <input type = "file" accept=".jpg, .png, .jpeg" name = "clientImage" id = "mainClient-${index}" onchange="photoLoad('main-client-${index}', 'mainClient-${index}')" required>
                                            <label for = "mainClient-${index}"  style="display: none;">Add photo</label>
                                            <div class = "nameOfMainClient">
                                            <span class = "fs-12 light-text">${partner.name}</span>
                                                <input type = "text" placeholder="Insert name of main client" name = "mainClientName" required>
                                            </div>
                                        </div>
                                        <div class = "remove-photo"><input type = "button" onclick = "unlaodPhoto('main-client-${index}')" value = "Remove photo"></div>
                                    </div>`).join(' ')
                                    )
            } else {
                mainClientLogo = realReferralClient.replace('{mainClient}', `<div class = "main-card">
                                        <div class = "main-client" id = "main-client-3">
                                            <input type = "file" accept=".jpg, .png, .jpeg" name = "clientImage" id = "mainClient-3" onchange="photoLoad('main-client-3', 'mainClient-3')" required>
                                            <label for = "mainClient-3"  style="display: block;">Add photo</label>
                                            <div class = "nameOfMainClient">
                                            <span class = "fs-12 light-text">NO NAME</span>
                                                <input type = "text" placeholder="Insert name of main client" name = "mainClientName" required>
                                            </div>
                                        </div>
                                        <div class = "remove-photo"><input type = "button" onclick = "unlaodPhoto('main-client-3')" value = "Remove photo"></div>
                                    </div>
                                    <div class = "main-card">
                                        <div class = "main-client" id = "main-client-4">
                                            <input type = "file" accept=".jpg, .png, .jpeg" name = "clientImage" id = "mainClient-4" onchange="photoLoad('main-client-4', 'mainClient-4')" required>
                                            <label for = "mainClient-4"  style="display: block;">Add photo</label>
                                            <div class = "nameOfMainClient">
                                            <span class = "fs-12 light-text">NO NAME</span>
                                                <input type = "text" placeholder="Insert name of main client" name = "mainClientName" required>
                                            </div>
                                        </div>
                                        <div class = "remove-photo"><input type = "button" onclick = "unlaodPhoto('main-client-4')" value = "Remove photo"></div>
                                    </div>
                                    <div class = "main-card">
                                        <div class = "main-client" id = "main-client-5">
                                            <input type = "file" accept=".jpg, .png, .jpeg" name = "clientImage" id = "mainClient-5" onchange="photoLoad('main-client-5', 'mainClient-5')" required>
                                            <label for = "mainClient-5"  style="display: block;">Add photo</label>
                                            <div class = "nameOfMainClient">
                                            <span class = "fs-12 light-text">NO NAME</span>
                                                <input type = "text" placeholder="Insert name of main client" name = "mainClientName" required>
                                            </div>
                                        </div>
                                        <div class = "remove-photo"><input type = "button" onclick = "unlaodPhoto('main-client-5')" value = "Remove photo"></div>
                                    </div>
                                    `)
            }
            let location = mainClientLogo.replace("{location}", getLocation
                .filter(partner => locationFlat.includes(partner.id))
                .map(partner =>
                    `<div class="city" id="${partner.name.toLowerCase().replace("-", " ")}" onclick = "deleteItem('${partner.name.toLowerCase().replace("-", " ")}')">${partner.name}<span style="color: white;">X</span></div>`
                ).join(" ")
            )
            let mainService = location.replace("{mainServices}", getMainService
                .filter(partner => mainServFlat.includes(partner.id))
                .map(partner =>
                    `<div class="service" id="${partner.name}" onclick = "deleteItemMainServices('${partner.name}')">${partner.name}<span style="color: white;">X</span></div>`
                ).join(" ")
            )
            let distService = mainService.replace("{distinctiveServices}", getDisService
                .filter(partner => disServFlat.includes(partner.id))
                .map(partner =>
                    `<div class="serviceD" id="${partner.name}" onclick = "deleteItemDServices('${partner.name}')">${partner.name}<span style="color: white;">X</span></div>`
                ).join(" ")
            )
            let managedMedia = distService.replace("{managedMedia}", getManMedia
                .filter(partner => manaMediaFlat.includes(partner.id))
                .map(partner =>
                    `<div class="Mmedia" id="${partner.name}" onclick = "deleteItemManMedia('${partner.name}')">${partner.name}<span style="color: white;">X</span></div>`
                ).join(" ")
            )
            let managedPlatform = managedMedia.replace("{managedPlatforms}", getManPlatform
                .filter(partner => manaPlatformFlat.includes(partner.id))
                .map(partner =>
                    `<div class="Mplatformm" id="${partner.name}" onclick = "deleteItemManPlatform('${partner.name}')">${partner.name}<span style="color: white;">X</span></div>`
                ).join(" ")
            )
            let mainSch = managedPlatform.replace('{mainSch}', mainsC.join(" "));
            let disSch = mainSch.replace('{disSch}', distsC.join(" "));
            let mediaSch = disSch.replace('{mediaSch}', mediaC.join(" "));
            let platformSch = mediaSch.replace('{platformSch}', platC.join(" "));
            let planning = platformSch.replace("{planning}", realName.map(partner => partner.planning == true ? `<input type = "checkbox" id = "planning" name = "planning" checked>` : `<input type = "checkbox" id = "planning" name = "planning">`));
            let project = planning.replace("{project}", realName.map(partner => partner.project == true ? `<input type = "checkbox" id = "project" name = "project" checked>` : `<input type = "checkbox" id = "project" name = "project">`));
            let task = project.replace("{task}", realName.map(partner => partner.task == true ? `<input type = "checkbox" id = "task" name = "task" checked>` : `<input type = "checkbox" id = "task" name = "task">`));
            let platform = task.replace("{platform}", realName.map(partner => partner.platform == true ? `<input type = "checkbox" id = "platform" name = "platform" checked>` : `<input type = "checkbox" id = "platform" name = "platform">`));
            let reporting = platform.replace("{reporting}", realName.map(partner => partner.reporting == true ? `<input type = "checkbox" id = "reporting" name = "reporting" checked>` : `<input type = "checkbox" id = "reporting" name = "reporting">`));
            let dataAnalysis = reporting.replace("{dataAnalysis}", realName.map(partner => partner.dataAnalysis == true ? `<input type = "checkbox" id = "dataAnalysis" name = "dataAnalysis" checked>` : `<input type = "checkbox" id = "dataAnalysis" name = "dataAnalysis">`));
            let adServer = dataAnalysis.replace("{adServer}", realName.map(partner => partner.adServer == true ? `<input type = "checkbox" id = "adServer" name = "adServer" checked>` : `<input type = "checkbox" id = "adServer" name = "adServer">`));
            let adVerification = adServer.replace("{adVerification}", realName.map(partner => partner.AdVerification == true ? `<input type = "checkbox" id = "AdVerification" name = "AdVerification" checked>` : `<input type = "checkbox" id = "AdVerification" name = "AdVerification">`));

            res.writeHead(200, {'ContentType': 'text/html'});
            res.end(adVerification);

        } catch(err) {
            if (err) {
                console.log("Errore nel caricamento della pagina: " + err);
            }
        }
        return
    }

    if (method === 'POST' && url === '/edit.html') {
        let id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
        let cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
        let emailFromCookie = cookies.email || 'Nessun cookie trovato';
        let getAgencyName = await dbLayer.getAllDataFromDB(id_cardsAgency);
        let form = formidable({ multiples: false,
            uploadDir: './uploads/',
            keepExtensions: true,
        }); 

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    console.error("Errore nella modifica dei dati");
                } else {
                    const updateData = getAgencyName
                        .filter(part => part.email == emailFromCookie)
                        .map(part => part.id)

                    let resultLoc = [];
                    let resultMainS = [];
                    let resultDisS = [];
                    let resultMediS = [];
                    let resultPlatS = [];
                    let resultRefCli = [];
                    var user = {};

                    if (fields.finalLocation) {
                        let finalLocation = fields.finalLocation;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];
                    
                        let locationReal = locationsArray.map(part =>
                            part
                                .trim()
                                .split(/[\s\-]/)
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                                .join(' ')
                        );
                    
                        console.log("Città separate: ", locationReal);
                    
                        resultLoc = await dbLayer.searchIdOfLocationFromDb(id_cardsAgency, locationReal);
                        console.log(resultLoc);
                    }                    

                    if (fields.mainServiceFinal) {
                        let finalLocation = fields.mainServiceFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultMainS = await dbLayer.searchIdOfMainSFromDb(id_cardsAgency, locationsArray);
                        console.log(resultMainS);
                    }

                    if (fields.distinctiveServiceFinal) {
                        let finalLocation = fields.distinctiveServiceFinal;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultDisS = await dbLayer.searchIdOfDisFromDb(id_cardsAgency, locationsArray);
                        console.log(resultDisS);
                    }

                    if (fields.mMediaIn) {
                        let finalLocation = fields.mMediaIn;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultMediS = await dbLayer.searchIdOfMediaFromDb(id_cardsAgency, locationsArray);
                        console.log(resultMediS);
                    }

                    if (fields.mPlatformIn) {
                        let finalLocation = fields.mPlatformIn;
                        let locationsArray = finalLocation[0].includes(',')
                            ? finalLocation[0].split(',')
                            : [finalLocation[0]];

                        resultPlatS = await dbLayer.searchIdOfPlatformFromDb(id_cardsAgency, locationsArray);
                        console.log(resultPlatS);
                    }

                    let fileBase64;

                    if (files.newLogo && files.newLogo[0]) {
                        let filePath = files.newLogo[0].filepath;
                        let fileBuffer = fs.readFileSync(filePath);
                        fileBase64 = fileBuffer.toString('base64');
                        user = {
                            logo: fileBase64,
                        }
                        fs.unlinkSync(filePath);
                    }

                    let fileBase64Ref;
                    let nameMainCl;
                    let mainClientReal = [];

                    if (files.clientImage && files.clientImage[0] && fields.mainClientName) {
                        for (let a = 0; a < files.clientImage.length; a++) {
                            let filePath = files.clientImage[a].filepath;
                            let fileBuffer = fs.readFileSync(filePath);
                            fileBase64Ref = fileBuffer.toString('base64');
                            nameMainCl = fields.mainClientName[a];
                            await dbLayer.createPageMainClientCards(fileBase64Ref, nameMainCl);
                            fs.unlinkSync(filePath);
                            mainClientReal.push(await dbLayer.getIdMainClientPageEdit(id_cardsAgency, fields.mainClientName[a]));
                        }

                        user = {
                            mainClient: mainClientReal,
                        }
                    }

                    let fileBase64RefC;
                    let clientRealRef = await dbLayer.getAllDataFromDB(id_cardsAgency);
                    let cc = clientRealRef 
                        .filter(partner => partner.email == emailFromCookie)
                        .map(partner => partner.referralClient)
                    let refCFlat = cc.flat()
                    let referralClient = [];
                    referralClient.push(refCFlat);
                    let refC = {};

                    console.log(referralClient);

                    if (files.photoRefferral && files.photoRefferral[0]) {
                        let filePath = files.photoRefferral[0].filepath;
                        let fileBuffer = fs.readFileSync(filePath);
                        fileBase64RefC = fileBuffer.toString('base64');
                        refC = {
                            name: fields.nameAndSurname.toString(),
                            surname: fields.surname.toString(),
                            workAs: fields.profession.toString(),
                            photo: fileBase64RefC,
                            workWhere: fields.mainClient.toString(),
                        }
                        await dbLayer.createReferralClient(refC);
                        fs.unlinkSync(filePath);
                        referralClient.push(await dbLayer.getIdReferralClient(id_cardsAgency, fields.nameAndSurname.toString()));


                        console.log(referralClient.flat());
                        user = {
                            referralClient: referralClient.flat(),
                        }
                    }

                    if (fields.idDaTogliere) {
                        let idToRemove = parseFloat(fields.idDaTogliere[0]);
                        let refCliFlat = referralClient.flat();
                        let index = refCliFlat.findIndex(client => client == idToRemove);
                        if (index !== -1) {
                            refCliFlat.splice(index, 1);
                        }
                        user = {
                            referralClient: refCliFlat,
                        };
                    }

                    if (fields.agencyName) {
                        user = {
                            name: fields.agencyName ? fields.agencyName.toString() : undefined,
                            agencyType: fields.agencyType.toString().replace(/-/g, " "),
                            managedBilling: fields.managedBilling ? fields.managedBilling.toString() : undefined,
                            numberOfEmployees: fields.employeesNumber ? fields.employeesNumber.toString() : undefined,
                            awareness: fields.awareness ? true : false,
                            conversion: fields.conversion ? true : false,
                            consideration: fields.consideration ? true : false,
                            location: (resultLoc.length !== 0) ? resultLoc : undefined,
                        }
                    }

                    if (fields.website) {
                        user = {
                            website: fields.website ? fields.website.toString() : undefined,
                            linkedin: fields.linkedin ? fields.linkedin.toString() : undefined,
                            facebook: fields.facebook ? fields.facebook.toString() : undefined,
                            // email: fields.email ? fields.email.toString() : undefined,
                        }
                    }

                    if (fields.mainServiceFinal) {
                        user = {
                            mainService: (resultMainS.length !== 0) ? resultMainS : undefined,
                            distinctiveService: (resultDisS.length !== 0) ? resultDisS : undefined,
                        }
                    }

                    if (fields.mMediaIn) {
                        user = {
                            mMedia: (resultMediS.length !== 0) ? resultMediS : undefined,
                            mPlatform: (resultPlatS.length !== 0) ? resultPlatS : undefined,
                        }
                    }

                    if (fields.newBrochure) {
                        user = {
                            brochure: fields.newBrochure ? fields.newBrochure.toString() : undefined,
                            caseStudy: fields.newCasestudy ? fields.newCasestudy.toString() : undefined,
                            mainClient: (mainClientReal.length !== 0) ? mainClientReal : undefined,
                        }
                    }

                    if (fields.planning) {
                        user = {
                            planning: fields.planning ? true : false,
                            project: fields.project ? true : false,
                            task: fields.task ? true : false,
                            platform: fields.platform ? true : false,
                            reporting: fields.reporting ? true : false,
                            dataAnalysis: fields.dataAnalysis ? true : false,
                            adServer: fields.adServer ? true : false,
                            AdVerification: fields.AdVerification ? true : false,
                        }
                    }

                    let result = dbLayer.updateUser(user, updateData[0]);
                    console.log(result);
                    console.log(fields);

                    res.writeHead(302, {'Location':'./edit.html'});
                    res.end();

                }
            } catch(err) {
                console.log(err);
            }
        })
        return
    }

    let staticPath = './';
    let filePath = join(staticPath, url);
    let fileExt = extname(filePath);

    if (mimeTypes[fileExt]) {
        try {
            let fileStream = createReadStream(filePath);
            res.writeHead(200, { 'Content-Type': mimeTypes[fileExt] });
            fileStream.pipe(res);
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File non trovato');
        }
        return;
    }

    // Risposta di default
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Pagina non trovata');
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening to 127.0.0.1");
});