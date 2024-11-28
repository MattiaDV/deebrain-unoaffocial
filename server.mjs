import Odoo from 'node-odoo';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join } from 'node:path';
import { json } from 'stream/consumers';

const connectionDb = new Odoo({
    host: 'localhost',
    port: 8069,
    database: 'addons-listing',
    username: 'admin',
    password: 'admin',
});




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

function getDisFromDb(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('location_listing', params, (err, partners) => {
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

                    // Genera le opzioni HTML
                    const locationOptions = enrichedPartners
                    .filter(partner => partner.name !== false)
                    .map(partner => ({
                        ...partner,
                        managedBilling: partner.managedBilling > 999999 ? (partner.managedBilling / 1000000) + "M" : partner.managedBilling > 999 ? (partner.managedBilling / 1000) + "k" : partner.managedBilling,
                    }))
                    .map(partner => `
                        <div class="card-account ${partner.agencyType.replace(' ', '-')} ${partner.locations.join(' ').toLowerCase()} ${partner.mainSS.join(' ').toLowerCase()} ${partner.disSS.join(' ').toLowerCase()} ${partner.mediaSS.join(' ').toLowerCase()} ${partner.platformSS.join(' ').toLowerCase()}">
                            <div class="left-part-card">
                                <img src="img/logo.png">
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
                                        <div class="a">Awareness</div>
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

    if (method === 'GET' && url === '/listing.html') {
        try {
            const htmlContent = await readFile('listing.html', 'utf8');
            const id_cardsAgency = Array.from({ length: 440 }, (_, i) => i);
            const cardsAgency = await getNewAgencyFromDB(id_cardsAgency);
            const updatedHtmlContent = htmlContent.replace("{cards}", cardsAgency.join(''));

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedHtmlContent);
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
