const Pool = require('pg-pool');

const pool = new Pool({
    user: 'admin',      
    host: 'localhost',  
    database: 'addons-listing', 
    password: 'admin',  
    port: 8069,  
    // keep_alive: true, 
    // statement_timeout: 3000,  
    // query_timeout: 3000,
    // connectionTimeoutMillis: 10000,
    // keepAlive: true,
});


exports.updateUser = function(param, id) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE users_model SET
                logo = $1,
                name = $2,
                agencyType = $3,
                managedBilling = $4,
                numberOfEmployees = $5,
                awareness = $6,
                conversion = $7,
                consideration = $8,
                locations = $9,
                website = $10,
                linkedinLink = $11,
                facebookLink = $12,
                mainServices = $13,
                distinctiveServices = $14,
                managedMedia = $15,
                managedPlatform = $16,
                brochure = $17,
                caseStudy = $18,
                clientLogos = $19,
                planning = $20,
                project = $21,
                task = $22,
                platform = $23,
                reporting = $24,
                dataAnalysis = $25,
                adServer = $26,
                AdVerification = $27,
                referralClient = $28
            WHERE id = $29
        `;
        const values = [
            param.logo,
            param.name,
            param.agencyType,
            param.managedBilling,
            param.numberOfEmployees,
            param.awareness,
            param.conversion,
            param.consideration,
            param.location,
            param.website,
            param.linkedin,
            param.facebook,
            param.mainService,
            param.distinctiveService,
            param.mMedia,
            param.mPlatform,
            param.brochure,
            param.caseStudy,
            param.mainClient,
            param.planning,
            param.project,
            param.task,
            param.platform,
            param.reporting,
            param.dataAnalysis,
            param.adServer,
            param.AdVerification,
            param.referralClient,
            id
        ];
        
        pool.query(query, values)
            .then(result => resolve(result))
            .catch(err => reject("Errore nell'aggiornamento dell'utente: " + JSON.stringify(err)));
    });
}

exports.createPageMainClientCards = function(param, name) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO main_client_logos (name, logo) VALUES ($1, $2) RETURNING *;";
        let values = [name, param];
        pool.query(query, values, (err, result) => {
            if (err) {
                console.error("Errore nella creazione dei Main client: " + err.message);
                reject(err);
            } else {
                resolve(result.rows[0]);
            }
        });
    })
}

exports.createReferralClient = function(param) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO users_referral_client (name, surname, workAs, photo, workWhere) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
        let values = [param.name, param.surname, param.workAs, param.photo, param.workWhere];
        pool.query(query, values, async (err, result) => {
            if (err) {
                console.log("Errore nella creazione dei referral client: " + JSON.stringify(err));
                reject(err);
            } else {
                resolve(result.rows[0]);
            }
        })

    })
}

exports.getIdMainClientPageEdit = function(param, acc) {
    return new Promise((resolve, reject) => {
        let query = "SELECT id FROM main_client_logos WHERE id=ANY($1)";
        let values = [param];
        pool.query(query, values, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                console.log("Fondatori richiesti: ", acc);
                const sortedPartners = partners.sort((a, b) => b.id - a.id);
                const firstMatch = sortedPartners.find(partner => partner.name === acc);
                const cit = firstMatch ? firstMatch.id : null;

                console.log("ID trovato: ", cit);
                resolve(cit);
            }
        })
    });
}

exports.getIdReferralClient = function(param, acc) {
    return new Promise((resolve, reject) => {
        let query = "SELECT id FROM users_referral_client WHERE id=ANY($1)";
        let values = [param];
        pool.query(query, values, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                console.log("Fondatori richiesti: ", acc);
                const sortedPartners = partners.sort((a, b) => b.id - a.id);
                const firstMatch = sortedPartners.find(partner => partner.name === acc);
                const cit = firstMatch ? firstMatch.id : null;

                console.log("ID trovato: ", cit);
                resolve(cit);
            }
        })
    });
}

exports.getIdFounders = function(param, acc) {
    return new Promise((resolve, reject) => {
        let query = "SELECT id FROM founder_name WHERE id=ANY($1)";
        let values = [param];
        pool.query(query, values, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                console.log("Fondatori richiesti: ", acc);
                const sortedPartners = partners.sort((a, b) => b.id - a.id);
                const firstMatch = sortedPartners.find(partner => partner.name === acc);
                const cit = firstMatch ? firstMatch.id : null;

                console.log("ID trovato: ", cit);
                resolve(cit);
            }
        })
    });
}

exports.createFounderForDb = function(founderNames) {
    return Promise.all(
        founderNames.map(element => {
            return new Promise((resolve, reject) => {
                console.log("ELEMENT: " + element);
                
                const query = "INSERT INTO founder_name (name) VALUES ($1) RETURNING *;";
                const values = [element];

                pool.query(query, values)
                    .then((result) => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        console.error(`Errore nella creazione del founder ${element}: ${err.message}`);
                        reject(err);
                    });
            });
        })
    );
}

exports.searchIdLoc = function(param, acc) {
    return new Promise((resolve, reject) => {
        let query = "SELECT id FROM location_listing WHERE id=ANY($1)";
        let values = [param];
        pool.query(query, values, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                console.log("Fondatori richiesti: ", acc);
                const sortedPartners = partners.sort((a, b) => b.id - a.id);
                const firstMatch = sortedPartners.find(partner => partner.name === acc);
                const cit = firstMatch ? firstMatch.id : null;

                console.log("ID trovato: ", cit);
                resolve(cit);
            }
        })
    });
}

exports.searchIdOfLocationFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM location_listing WHERE id=ANY($1)";
        let values = [param];
        pool.query(query, values, async (err, partners) => {
            if (err) {
                reject("Errore nella ricerca degli id: " + JSON.stringify(err));
            } else {
                const cities = acc.flatMap(city => city.split(','));
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
        const query = "SELECT * FROM managed_media WHERE id = ANY($1)";
        const values = [param]; 

        pool.query(query, values)
            .then((result) => {
                const cities = acc.flatMap(city => city.split(','));
                console.log("Città separate: ", cities);

                const cit = result.rows
                    .filter(partner => cities.includes(partner.name))
                    .map(partner => partner.id);

                resolve(cit); 
            })
            .catch((err) => {
                console.error("Errore nella ricerca degli id: ", err);
                reject("Errore nella ricerca degli id: " + err.message);
            });
    });
}

exports.searchIdOfPlatformFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM managed_platform WHERE id = ANY($1)";
        const values = [param];

        pool.query(query, values)
            .then((result) => {
                const cities = acc.flatMap(city => city.split(','));
                console.log("Città separate: ", cities);

                const cit = result.rows
                    .filter(partner => cities.includes(partner.name))
                    .map(partner => partner.id);

                resolve(cit);
            })
            .catch((err) => {
                console.error("Errore nella ricerca degli id: ", err);
                reject("Errore nella ricerca degli id: " + err.message);
            });
    });
}

exports.searchIdOfMainSFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM main_services WHERE id = ANY($1)";
        const values = [param];

        pool.query(query, values)
            .then((result) => {
                const cities = acc.flatMap(city => city.split(','));
                console.log("Città separate: ", cities);

                const cit = result.rows
                    .filter(partner => cities.includes(partner.name))
                    .map(partner => partner.id);

                resolve(cit);
            })
            .catch((err) => {
                console.error("Errore nella ricerca degli id: ", err);
                reject("Errore nella ricerca degli id: " + err.message);
            });
    });
}

exports.searchIdOfDisFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM distinctive_services WHERE id = ANY($1)";
        const values = [param];

        pool.query(query, values)
            .then((result) => {
                const cities = acc.flatMap(city => city.split(','));
                console.log("Città separate: ", cities);

                const cit = result.rows
                    .filter(partner => cities.includes(partner.name))
                    .map(partner => partner.id);

                resolve(cit);
            })
            .catch((err) => {
                console.error("Errore nella ricerca degli id: ", err);
                reject("Errore nella ricerca degli id: " + err.message);
            });
    });
} 

exports.searchIdOfReferralFromDb = function(param, acc) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users_referral_client WHERE id = ANY($1)";
        const values = [param];

        pool.query(query, values)
            .then((result) => {
                const cit = result.rows
                    .filter(partner => acc.includes(partner.name))
                    .map(partner => partner.id);

                resolve(cit);
            })
            .catch((err) => {
                reject("Errore nella ricerca degli id: " + err.message);
            });
    });
}

exports.createUser = function(user) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO users_model 
            (name, founder_name, number_of_employees, foundation_year, agency_type, logo, managed_billing, awareness, conversion, 
            website, linkedin_link, facebook_link, email, locations, main_services, distinctive_services, managed_media, 
            managed_platform, referral_client, brochure, case_study, client_logos) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) 
            RETURNING *;
        `;

        const values = [
            user.name,
            user.founderName,
            user.numberOfEmployees,
            user.foundationYear,
            user.agencyType,
            user.fileBase64,
            user.managedBilling,
            user.awareness,
            user.conversion,
            user.website,
            user.linkedinLink,
            user.facebookLink, 
            user.email,
            user.resultLoc,
            user.resultMainS,
            user.resultDisS,
            user.resultMediS,
            user.resultPlatS,
            user.referralClientReal,
            user.brochure,
            user.caseStudy,
            user.mainClientReal
        ];

        pool.query(query, values)
            .then((result) => {
                resolve(result.rows[0]);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


exports.getAllDataFromDB = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users_model WHERE id = ANY($1)";
        const values = [params];

        pool.query(query, values)
            .then((result) => {
                const locationOptions = result.rows;
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle tipologie di agenzia: " + err.message);
            });
    });
}

exports.getAllReferralClientFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users_referral_client WHERE id = ANY($1)";
        const values = [params];

        pool.query(query, values)
            .then((result) => {
                const locationOptions = result.rows;
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle tipologie di agenzia: " + err.message);
            });
    });
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
    });
}

exports.getNormalAgencyTypeFromDB = function(params) {
    return new Promise((resolve, reject) => {
        let agencys = [];
        for (let agencyT of agencyType) {
            agencys.push(agencyT);
        }
        resolve(agencys);
    });
}

exports.getFounderNamesFromDB = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM founder_name WHERE name = $1";
        const values = [params];
        pool.query(query, values)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei founder names: " + JSON.stringify(err));
            });
    });
}

exports.getLocationsFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM location_listing WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                const locationOptions = result.rows
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle location: " + err);
            });
    });
}

exports.getNormalLocationsFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM location_listing WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle location: " + err);
            });
    });
}

exports.getMainFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM main_services WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                const locationOptions = result.rows
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei main services: " + JSON.stringify(err));
            });
    });
}

exports.getNormalMainFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM main_services WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei main services: " + JSON.stringify(err));
            });
    });
}

exports.getDisFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM distinctive_services WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                const locationOptions = result.rows
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei distinctive services: " + JSON.stringify(err));
            });
    });
}

exports.getNormalDisFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM distinctive_services WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei distinctive services: " + JSON.stringify(err));
            });
    });
}

exports.getMediaFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM managed_media WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                const locationOptions = result.rows
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei managed media services: " + JSON.stringify(err));
            });
    });
}

exports.getNormalMediaFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM managed_media WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei managed media service: " + JSON.stringify(err));
            });
    });
}

exports.getPlatformFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM managed_platform WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                const locationOptions = result.rows
                    .map(partner => `<option value='${partner.name}'>${partner.name}</option>`);
                resolve(locationOptions);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle managed platform service: " + JSON.stringify(err));
            });
    });
}

exports.getNormalPlatformFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM managed_platform WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca delle managed platform service: " + JSON.stringify(err));
            });
    });
}

exports.getNormalMainClientFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM main_client_logos WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei main client: " + JSON.stringify(err));
            });
    });
}

exports.getNormalReferralClientFromDb = function(params) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users_referral_client WHERE name IS NOT NULL";
        pool.query(query)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((err) => {
                reject("Errore nella ricerca dei referral client: " + JSON.stringify(err));
            });
    });
}

exports.getNewAgencyFromDB = function(params) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users_model WHERE id = $1', [params], async (err, result) => {
            if (err) {
                reject("Errore nella ricerca delle location: " + err);
            } else {
                const partners = result.rows;

                try {
                    const enrichedPartners = await Promise.all(
                        partners.map(async (partner) => {
                            const locationIds = partner.locations; 

                            const locations = await new Promise((res, rej) => {
                                pool.query('SELECT * FROM location_listing WHERE id = ANY($1)', [locationIds], (err, locResult) => {
                                    if (err) rej(err);
                                    else res(locResult.rows);
                                });
                            });

                            const mainS = partner.mainServices; 

                            const mainSS = await new Promise((res, rej) => {
                                pool.query('SELECT * FROM main_services WHERE id = ANY($1)', [mainS], (err, mainResult) => {
                                    if (err) rej(err);
                                    else res(mainResult.rows);
                                });
                            });

                            const disS = partner.distinctiveServices; 

                            const disSS = await new Promise((res, rej) => {
                                pool.query('SELECT * FROM distinctive_services WHERE id = ANY($1)', [disS], (err, disResult) => {
                                    if (err) rej(err);
                                    else res(disResult.rows);
                                });
                            });

                            const mediaS = partner.managedMedia; 

                            const mediaSS = await new Promise((res, rej) => {
                                pool.query('SELECT * FROM managed_media WHERE id = ANY($1)', [mediaS], (err, mediaResult) => {
                                    if (err) rej(err);
                                    else res(mediaResult.rows);
                                });
                            });

                            const platformS = partner.managedPlatform; 

                            const platformSS = await new Promise((res, rej) => {
                                pool.query('SELECT * FROM managed_platform WHERE id = ANY($1)', [platformS], (err, platformResult) => {
                                    if (err) rej(err);
                                    else res(platformResult.rows);
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
                            <div class="card-account ${partner.agencyType.replace(/ /g, "-")} ${partner.locations.join(' ').toLowerCase()} ${partner.mainSS.join(' ').toLowerCase()} ${partner.disSS.join(' ').toLowerCase()} ${partner.mediaSS.join(' ').toLowerCase()} ${partner.platformSS.join(' ').toLowerCase()}">
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

pool.connect((err, client, release) => {
    if (err) {
        console.error("Connessione non riuscita: ", err);
    } else {
        console.log("Connessione al database riuscita");
        release();
    }
});