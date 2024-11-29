import Odoo from 'node-odoo';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join } from 'node:path';
import cookie from 'cookie';
import { escape } from 'node:querystring';
import formidable from 'formidable';

const connectionDb = new Odoo({
    host: 'localhost',
    port: 8069,
    database: 'addons-listing',
    username: 'admin',
    password: 'admin',
});

function searchIdOfLocationFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('location_listing', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cities = acc.flatMap(city => city.split(' '));
                console.log("Città separate: ", cities);

                const cit = partners
                    .filter(partner => cities.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
}
 

function searchIdOfMediaFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_media', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cit = partners
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
}  

function searchIdOfPlatformFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_platform', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cit = partners
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
}  

function searchIdOfMainSFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('main_services', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cit = partners
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
}  

function searchIdOfDisFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('distinctive_services', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cit = partners
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
} 

function searchIdOfReferralFromDb(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_referral_client', param, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cit = partners
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);
                resolve(cit); 
            }
        });
    });
} 

function createUser(user) {
    return new Promise((resolve, reject) => {
        connectionDb.create('users_model', user, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result); 
            }
        });
    });
}


function getAllDataFromDB(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_model', params, (err, part) => {
            if (err) {
                reject("Errore nella ricerca delle tipologie di agenzia: " + JSON.stringify(err));
            } else {
                const locationOptions = part 
                resolve(locationOptions);
            }
        })
    })
}

function getAgencyTypeFromDB(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_model', params, (err, part) => {
            if (err) {
                reject("Errore nella ricerca delle tipologie di agenzia: " + JSON.stringify(err));
            } else {
                const locationOptions = part 
                    .filter(partner => partner.name)
                    .map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.agencyType.replace(" ", '-')}" checked> ${partner.agencyType}</li>`);
                resolve(locationOptions);
            }
        })
    })
}

function getFounderNamesFromDB(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('founder_name', params, (err, part) => {
            if (err) {
                reject("Errore nella ricerca delle tipologie di agenzia: " + JSON.stringify(err));
            } else {
                const locationOptions = part 
                resolve(locationOptions);
            }
        })
    })
}

function getLocationsFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('location_listing', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca delle location: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalLocationsFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('location_listing', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca delle location: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getMainFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('main_services', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei main services: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalMainFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('main_services', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei main services: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getDisFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('distinctive_services', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei distinctive service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalDisFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('distinctive_services', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei distinctive service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getMediaFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_media', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei managed media service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalMediaFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_media', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei managed media service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getPlatformFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_platform', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca delle managed platform service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalPlatformFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_platform', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca delle managed platform service: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalMainClientFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('main_client_logos', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei main client: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getNormalReferralClientFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_referral_client', params, (err, partners) => {
            if (err) {
                reject("Errore nella ricerca dei referral client: " + JSON.stringify(err));
            } else {
                const locationOptions = partners
                    .filter(partner => partner.name !== false)
                    .map(partner => partner);
                resolve(locationOptions);
            }
        });
    });
}

function getNewAgencyFromDB(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_model', params, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca delle location: " + JSON.stringify(err));
            } else {
                try {
                    const enrichedPartners = await Promise.all(
                        partners.map(async (partner) => {
                            const locationIds = partner.locations; 

                            const locations = await new Promise((res, rej) => {
                                connectionDb.get('location_listing', locationIds, (err, locationData) => {
                                    if (err) rej(err);
                                    else res(locationData);
                                });
                            });

                            const mainS = partner.mainServices; 

                            const mainSS = await new Promise((res, rej) => {
                                connectionDb.get('main_services', mainS, (err, mainService) => {
                                    if (err) rej(err);
                                    else res(mainService);
                                });
                            });

                            const disS = partner.distinctiveServices; 

                            const disSS = await new Promise((res, rej) => {
                                connectionDb.get('distinctive_services', disS, (err, distinctiveService) => {
                                    if (err) rej(err);
                                    else res(distinctiveService);
                                });
                            });

                            const mediaS = partner.managedMedia; 

                            const mediaSS = await new Promise((res, rej) => {
                                connectionDb.get('managed_media', mediaS, (err, medias) => {
                                    if (err) rej(err);
                                    else res(medias);
                                });
                            });

                            const platformS = partner.managedPlatform; 

                            const platformSS = await new Promise((res, rej) => {
                                connectionDb.get('managed_platform', platformS, (err, platforms) => {
                                    if (err) rej(err);
                                    else res(platforms);
                                });
                            });

                            return {
                                ...partner,
                                locations: locations.map(loc => loc.name),
                                mainSS: mainSS.map(mains => mains.name),
                                disSS: disSS.map(dist => dist.name),
                                mediaSS: mediaSS.map(med => med.name),
                                platformSS: platformSS.map(plat => plat.name)
                            };
                        })
                    );

                    const locationOptions = enrichedPartners
                    .filter(partner => partner.name !== false)
                    .map(partner => ({
                        ...partner,
                        managedBilling: partner.managedBilling > 999999 ? (partner.managedBilling / 1000000) + "M" : partner.managedBilling > 999 ? (partner.managedBilling / 1000) + "k" : partner.managedBilling,
                    }))
                    .map(partner => `
                        <div class="card-account ${partner.agencyType.replace(' ', '-')} ${partner.locations.join(' ').toLowerCase()} ${partner.mainSS.join(' ').toLowerCase()} ${partner.disSS.join(' ').toLowerCase()} ${partner.mediaSS.join(' ').toLowerCase()} ${partner.platformSS.join(' ').toLowerCase()}">
                            <div class="left-part-card">
                                <img src="${(partner.logo) ? 'http://127.0.0.1:8069/web/image/users_model/' + partner.id + '/logo' : ''}" alt = "Logo agency">
                            </div>
                            <div class="right-part-card">
                                <div class="upper-part-card">
                                    <span class="fs-16 medium-bold-text">
                                        ${partner.name}
                                    </span>
                                    <span class="fs-12 light-text">
                                        ${partner.agencyType}
                                    </span>
                                </div>
                                <div class="buttonss-listing-infos">
                                    <div class="location-a">
                                        <span class="loco">
                                            <svg fill="#0097b2" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 395.71 395.71" xml:space="preserve" stroke="#0097b2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path> </g> </g></svg>${partner.locations.join(', ')} <!-- Elenco nomi delle location -->
                                        </span>
                                        <div class="a">${(partner.awareness == true) ? ' - Awareness - ' : ''}</div>
                                        <div class="a">${(partner.conversion == true) ? ' - Conversion - ' : ''}</div>
                                        <div class="a">${(partner.consideration == true) ? ' - Consideration - ' : ''}</div>
                                    </div>
                                    <ul class="infos-card">
                                        <li class="light-text fs-12">
                                            <span class="info-agency number-employee light-text fs-18">${partner.agencyType}</span>
                                        </li>
                                        <li class="light-text fs-12">
                                            <span class="info-agency number-employee light-text fs-18">${partner.numberOfEmployees} employees</span>
                                        </li>
                                        <li class="light-text fs-12">
                                            <span class="info-agency managed-billing light-text fs-18">${partner.managedBilling} Billing</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="bb">
                                    <button class="fs-18 light-text buttons-style-listing" onclick="window.location.href = 'alkemy.html';">Read more</button>
                                </div>
                            </div>
                        </div>
                    `);

                    resolve(locationOptions);
                } catch (err) {
                    reject("Errore nel recupero delle location: " + JSON.stringify(err));
                }
            }
        });
    });
}








connectionDb.connect(function(err) {
    if (err) {
        console.error("Connessione non riuscita: ", err);
    } else {
        console.log("Connessione al database riuscita");
    }
});

// Funzione per determinare il tipo MIME dei file
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
            const htmlContent = await readFile('index.html', 'utf8');
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
            const htmlContent = await readFile('register.html', 'utf8');
            const id_array_location = Array.from({ length: 440 }, (_, i) => i);
            const locationAll = await getLocationsFromDb(id_array_location);
            const mainServ = await getMainFromDb(id_array_location);
            const disServ = await getDisFromDb(id_array_location);
            const media = await getMediaFromDb(id_array_location);
            const platform = await getPlatformFromDb(id_array_location);
            const updatedHtmlContent = htmlContent.replace("{locations}", locationAll.join(''));
            const up = updatedHtmlContent.replace('{mainService}', mainServ);
            const upp = up.replace('{distinctiveService}', disServ);
            const uppp = upp.replace('{media}', media);
            const upppp = uppp.replace('{platform}', platform);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(upppp);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    if (method === 'POST' && url === '/register.html') {
        try {
            const htmlContent = await readFile('mypage.html', 'utf8');
            const form = formidable({ multiples: true }); 
            const id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
    
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
    
                    const founderNameArray = fields.founderName || []; 
                    const founderNameCommands = founderNameArray.map(name => {
                        return [0, 0, { name }]; 
                    });
    
                    let citys = [];
    
                    console.log(JSON.stringify(fields));
    
                    const user = {
                        name: fields.agencyName?.[0] || null,
                        founderName: founderNameCommands.name,
                        numberOfEmployees: fields.numberOfEmployees?.[0] || null,
                        foundationYear: fields.foundationYear?.[0] || null,
                        agencyType: fields.agencyType?.[0] || null,
                        logo: files.agencyLogo?.[0] || null,
                        managedBilling: fields.managedBilling?.[0] || null,
                        awareness: fields.awareness?.[0] === 'on',
                        conversion: fields.conversion?.[0] === 'on',
                        website: fields.agencyWebsite?.[0] || null,
                        linkedinLink: fields.agencyLinkedin?.[0] || null,
                        facebookLink: fields.agencyFacebook?.[0] || null,
                        email: fields.agencyEmail?.[0] || null,
                        locations: await searchIdOfLocationFromDb(id_cardsAgency, fields.selectedCitysFinal), 
                        mainServices: await searchIdOfMainSFromDb(id_cardsAgency, fields.mainServicesFinal),
                        distinctiveServices: await searchIdOfDisFromDb(id_cardsAgency, fields.distinctiveServiceFinal),
                        managedMedia: await searchIdOfMediaFromDb(id_cardsAgency, fields.managedMediaFinal),
                        managedPlatform: await searchIdOfPlatformFromDb(id_cardsAgency, fields.managedPlatformFinal),
                        referralClient: await searchIdOfReferralFromDb(id_cardsAgency, fields.nameAndSurnameRef),
                        brochure: fields.brochure?.[0] || null,
                        caseStudy: fields.caseStudy?.[0] || null,
                        clientLogos: files.mainClient || [], 
                    };
    
                    console.log("Utente da creare:", JSON.stringify(user, null, 2));
    
                    const result = await createUser(user);
                    console.log("Utente creato:", result);
    
                    if (!res.headersSent) {
                        res.writeHead(302, { 'Location': '/mypage.html' });
                        res.end(htmlContent);
                    }
    
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
            const htmlContent = await readFile('listing.html', 'utf8');
            const id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            const cardsAgency = await getNewAgencyFromDB(id_cardsAgency);
            const location = await getLocationsFromDb(id_cardsAgency);
            const mainS = await getNormalMainFromDb(id_cardsAgency);
            const disS = await getNormalDisFromDb(id_cardsAgency);
            const mediaM = await getNormalMediaFromDb(id_cardsAgency);
            const platformM = await getNormalPlatformFromDb(id_cardsAgency);
            const agencyTypes = await getAgencyTypeFromDB(id_cardsAgency);
            const normalLocation = await getNormalLocationsFromDb(id_cardsAgency);
            const updatedHtmlContent = htmlContent.replace("{cards}", cardsAgency.join(''));
            const filterAgencyType = updatedHtmlContent.replace("{filter-agencyType}", agencyTypes.join(''));
            const filterLocation = filterAgencyType.replace("{filter-location}", normalLocation.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            const filterMains = filterLocation.replace("{filter-mainService}", mainS.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            const filterDis = filterMains.replace("{filter-distinctiveService}", disS.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked> <option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            const filterMedia = filterDis.replace("{filter-managedMedia}", mediaM.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked> <option value='${partner.name}'>${partner.name}</option></li>`).join(''));
            const filterPlatform = filterMedia.replace("{filter-managedPlatform}", platformM.map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.name.toLowerCase().replace(" ", '-')}" checked><option value='${partner.name}'>${partner.name}</option></li>`).join(''));

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
            const htmlContent = await readFile('mypage.html', 'utf8');
            const id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
            const emailFromCookie = cookies.email || 'Nessun cookie trovato';
            const nameOfAgency = await getAllDataFromDB(id_cardsAgency);
            const founderNames = await getFounderNamesFromDB(id_cardsAgency);
            const locationName = await getNormalLocationsFromDb(id_cardsAgency);
            const updatedHtmlContent = htmlContent;
            const mainServiceLoad = await getNormalMainFromDb(id_cardsAgency);
            const distinctiveServiceLoad = await getNormalDisFromDb(id_cardsAgency);
            const managedMediaLoad = await getNormalMediaFromDb(id_cardsAgency);
            const managedPlatformLoad = await getNormalPlatformFromDb(id_cardsAgency);
            const mainClientLoad = await getNormalMainClientFromDb(id_cardsAgency);
            const referralClientLoad = await getNormalReferralClientFromDb(id_cardsAgency);

            const idFounder = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.founderName)

            const idLocation= nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.locations)

            const idMainServ = nameOfAgency 
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.mainServices)

            const idDisServ = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.distinctiveServices)

            const idMedia = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedMedia)

            const idPlatform = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.managedPlatform)

            const idMainClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.clientLogos)

            const idReferralClient = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)
                .map(partner => partner.referralClient)

            // console.log(idLocation);
            // console.log(idFounder);

            const idFounderFlat = idFounder.flat();
            const idLocationFlat = idLocation.flat();
            const idMainServFlat = idMainServ.flat();
            const idDisServFlat = idDisServ.flat();
            const idMediaFlat = idMedia.flat();
            const idPlatformFlat = idPlatform.flat();
            const idMainClientFlat = idMainClient.flat();
            const idRefCliFlat = idReferralClient.flat();

            // console.log(idLocationFlat);

            const realName = nameOfAgency
                .filter(partner => partner.name !== false)
                .filter(partner => partner.email == emailFromCookie)

            const realFounder = founderNames
                .filter(partner => idFounderFlat.includes(partner.id))
                .map(partner => partner.name)

            const realLocation = locationName
                .filter(partner => idLocationFlat.includes(partner.id))
                .map(partner => partner.name)

            const realMainServ = mainServiceLoad
                .filter(partner => idMainServFlat.includes(partner.id))
                .map(partner => partner.name)

            const realDisServ = distinctiveServiceLoad
                .filter(partner => idDisServFlat.includes(partner.id))
                .map(partner => partner)

            const realMedia = managedMediaLoad
                .filter(partner => idMediaFlat.includes(partner.id))
                .map(partner => partner.name)

            const realPlatform = managedPlatformLoad
                .filter(partner => idPlatformFlat.includes(partner.id))
                .map(partner => partner.name)
            
            const realMainClient = mainClientLoad
                .filter(partner => idMainClientFlat.includes(partner.id))
                .map(partner => partner)

            const realReferralClient = referralClientLoad
                .filter(partner => idRefCliFlat.includes(partner.id))
                .map(partner => partner)

            // console.log(realLocation);

            // console.log(realFounder);

            const realNames = updatedHtmlContent.replace('{agencyName}', realName.map(partner => partner.name));
            const realNamesURL = realNames.replace('{agencyNameURL}', realName.map(partner => partner.name));
            const yearsF = realNamesURL.replace('{yearOfFoundation}', realName.map(partner => partner.foundationYear));
            const customers = yearsF.replace('{customers}', realName.map(partner => partner.founderName.length));
            const foun = customers.replace('{founder}', realFounder.join(', '));
            const agencyTTT = foun.replace('{agencyTypePersonal}', realName.map(partner => partner.agencyType.replace('-', ' ').toUpperCase()));
            const bill = agencyTTT.replace('{billingPersonal}', realName.map(partner => (partner.managedBilling > 999999) ? (partner.managedBilling / 1000000) + "M" : (partner.managedBilling > 9999) ? (partner.managedBilling / 1000) + "k" : partner.managedBilling));
            const location = bill.replace('{locationPersonal}', realLocation.join(', '));
            const emploPers = location.replace('{employeesPersonalQuad}', realName.map(partner => partner.numberOfEmployees));
            const awareness = emploPers.replace('{awareness}', realName.map(partner => (partner.awareness == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Awareness</span>" : ''));
            const conversion = awareness.replace('{conversion}', realName.map(partner => (partner.conversion == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Conversion</span>" : ''));
            const consideration = conversion.replace('{consideration}', realName.map(partner => (partner.consideration == true) ? "<span class = 'awarenessAndConversion light-text fs-16'>Consideration</span>" : ''));
            const urlSito = consideration.replace('{urlSito}', realName.map(partner => partner.website));
            const urlLinkedin = urlSito.replace('{urlLinkedin}', realName.map(partner => partner.linkedinLink));
            const urlFacebook = urlLinkedin.replace('{urlFacebool}', realName.map(partner => partner.facebookLink));
            const emailContact = urlFacebook.replace('{emailContact}', realName.map(partner => partner.email));
            const titlePage = emailContact.replace('{titleName}', realName.map(partner => partner.name));
            const baseUrl = "http://127.0.0.1:8069/";
            const logoURL = titlePage.replace(
                '{logoUrl}',
                realName.map(partner =>
                    partner.logo 
                        ? `${baseUrl}/web/image/users_model/${partner.id}/logo`
                        : ''
                )
            );
            const mainServiceAdd = logoURL.replace('{mainServices}', realMainServ
                .map(partner => 
                    `<div class = "card-starter fs-18 normal-text">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V10Z" stroke="#000000" stroke-width="1.5"></path> <path d="M15 19H9" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.7484 2.37793L16.6643 2.5041C15.9082 3.63818 15.5302 4.20525 14.978 4.54836C14.8682 4.61658 14.7541 4.67764 14.6365 4.73115C14.0447 5.00025 13.3632 5.00025 12.0002 5.00025C10.6371 5.00025 9.95564 5.00025 9.36387 4.73115C9.2462 4.67764 9.13211 4.61658 9.02232 4.54836C8.47016 4.20524 8.09213 3.6382 7.33606 2.5041L7.25195 2.37793" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    <span class = "title-main-services-card">
                        ${partner}
                    </span>
                </div>`
                ).join('')
            )
            const distinctiveServiceAdd = mainServiceAdd.replace('{distinctiveServices}', realDisServ
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
            const mediaManaged = distinctiveServiceAdd.replace('{managedMedia}', realMedia
                .map(partner => 
                    `<div class = "card-container-gestiti">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 21L12 17L17 21M7.8 17H16.2C17.8802 17 18.7202 17 19.362 16.673C19.9265 16.3854 20.3854 15.9265 20.673 15.362C21 14.7202 21 13.8802 21 12.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V12.2C3 13.8802 3 14.7202 3.32698 15.362C3.6146 15.9265 4.07354 16.3854 4.63803 16.673C5.27976 17 6.11984 17 7.8 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span class = "fs-18 normal-text">
                            ${partner}
                        </span>
                    </div>`
                ).join('')
            )
            const managedPlatform = mediaManaged.replace('{platformManaged}', realPlatform
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
            const mainClient = managedPlatform.replace('{mainClients}', realMainClient
                .map(partner => 
                    `<div class = "main-card-client">
                        <h1>${partner.name}</h1>
                        <img src='${partner.logo 
                            ? `${baseUrl}/web/image/main_client_logos/${partner.id}/logo`
                            : ''}' alt = "mainClient logo">
                    </div>`
                ).join('')
            )
            const referralClient = mainClient.replace('{clientReferral}', realReferralClient
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
            const brochure = referralClient.replace('{brochureURL}', realName.map(partner => partner.brochure).join(''));
            const caseStudy = brochure.replace('{caseStudyURL}', realName.map(partner => partner.caseStudy).join(''));
            const linkedinFooter = caseStudy.replace('{linkedinFooter}', realName.map(partner => partner.linkedinLink).join(''));
            const websiteFooter = linkedinFooter.replace('{websiteFooter}', realName.map(partner => partner.website).join(''));
            // console.log(nameOfAgency);
            // console.log(emailFromCookie)

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(websiteFooter);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Errore del server interno');
        }
        return;
    }

    // Gestione dei file statici
    const staticPath = './'; // Cartella contenente i file statici
    const filePath = join(staticPath, url);
    const fileExt = extname(filePath);

    if (mimeTypes[fileExt]) {
        try {
            const fileStream = createReadStream(filePath);
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
    console.log("Listening");
});
