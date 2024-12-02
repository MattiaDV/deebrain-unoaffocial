const Odoo = require('./node_modules/node-odoo');

const connectionDb = new Odoo({
    host: 'localhost',
    port: 8069,
    database: 'addons-listing',
    username: 'admin',
    password: 'admin',
});

exports.createFounderForDb = function(founderNames) {
    return Promise.all(
        founderNames.map(element => {
            return new Promise((resolve, reject) => {
                console.log("ELEMENT: " + element);
                connectionDb.create('founder_name', {name: element}, (err, partner) => {
                    if (err) {
                        console.error(`Errore nella creazione del founder ${element}: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(partner);
                    }
                });
            });
        })
    );
}



exports.searchIdOfLocationFromDb = function(param, acc) {
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

exports.searchIdOfMediaFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_media', param, (err, partners) => {
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

exports.searchIdOfPlatformFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('managed_platform', param, (err, partners) => {
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

exports.searchIdOfMainSFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('main_services', param, (err, partners) => {
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

exports.searchIdOfDisFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        connectionDb.get('distinctive_services', param, (err, partners) => {
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

exports.searchIdOfReferralFromDb = function(param, acc) {
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

exports.createUser = function(user) {
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


exports.getAllDataFromDB = function(params) {
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

exports.getAllReferralClientFromDb = function(params) {
    return new Promise((resolve, reject) => {
        connectionDb.get('users_referral_client', params, (err, part) => {
            if (err) {
                reject("Errore nella ricerca delle tipologie di agenzia: " + JSON.stringify(err));
            } else {
                const locationOptions = part 
                resolve(locationOptions);
            }
        })
    })
}

let agencyType = [
    ('digital agency', 'Digital agency'),
    ('media center', 'Media center'),
    ('creative agency', 'Creative agency'),
    ('perform agency', 'Perform agency'),
    ('advertising agency', 'Advertising agency'),
    ('marketing agency', 'Marketing agency'),
    ('branding agency', 'Branding agency'),
    ('design agency', 'Design agency'),
    ('web agency', 'Web agency'),
    ('seo agency', 'SEO agency'),
    ('social media agency', 'Social media agency'),
    ('public relations-agency', 'Public relations agency'),
    ('event agency', 'Event agency'),
    ('consulting agency', 'Consulting agency'),
    ('production agency', 'Production agency'),
    ('influencer agency', 'Influencer agency'),
    ('digital marketing agency', 'Digital marketing agency'),
    ('content agency', 'Content agency'),
    ('advertising production agency', 'Advertising production agency'),
    ('motion-graphics agency', 'Motion graphics agency'),
    ('creative consulting agency', 'Creative consulting agency'),
    ('interactive agency', 'Interactive agency'),
    ('media buying agency', 'Media buying agency')
];

exports.getAgencyTypeFromDB = function(params) {
    return new Promise((resolve, reject) => {
        let agencys = [];
        for (let agencyT of agencyType) {
            agencys.push(agencyT);
        }
        let art = agencys
            .map(partner => `<li class="fs-16 light-text"><input type="checkbox" id="search-${partner.replace(/ /g, '-').toLowerCase()}" checked> ${partner.toLowerCase()}</li>`);
        resolve(art);
    })
}

exports.getNormalAgencyTypeFromDB = function(params) {
    return new Promise((resolve, reject) => {
        let agencys = [];
        for (let agencyT of agencyType) {
            agencys.push(agencyT);
        }
        let art = agencys
            .map(partner => partner);
        resolve(art);
    })
}

exports.getFounderNamesFromDB = function(params) {
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

exports.getLocationsFromDb = function(params) {
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

exports.getNormalLocationsFromDb = function(params) {
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

exports.getMainFromDb = function(params) {
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

exports.getNormalMainFromDb = function(params) {
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

exports.getDisFromDb = function(params) {
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

exports.getNormalDisFromDb = function(params) {
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

exports.getMediaFromDb = function(params) {
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

exports.getNormalMediaFromDb = function(params) {
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

exports.getPlatformFromDb = function(params) {
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

exports.getNormalPlatformFromDb = function(params) {
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

exports.getNormalMainClientFromDb = function(params) {
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

exports.getNormalReferralClientFromDb = function(params) {
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

exports.getNewAgencyFromDB = function(params) {
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
                                    <button class="fs-18 light-text buttons-style-listing" onclick="window.location.href = 'paginaD.html'; document.cookie = 'website=${partner.website}';">Read more</button>
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