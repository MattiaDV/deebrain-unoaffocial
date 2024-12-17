const { readFile } = require('fs/promises');
const cache = require('../api/cache');
const dbLayer = require('../api/dbLayer');
const cookie = require('cookie');
const { formidable } = require('formidable');

exports.postHome = async function(req,res) {
    try {
        let form = formidable({ multiples: true }); 
        let id_cardsAgency = Array.from({ length: 1000 }, (_, i) => i);

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
                let resultLocNotItaly = [];
                let languagesArr = [];
                let resultMainS = [];
                let resultDisS = [];
                let resultMediS = [];
                let resultPlatS = [];
                let mainClientS = [];

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
                
                if (fields.locationNotItalyFinal) {
                    let finalLocation = fields.locationNotItalyFinal;
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
                
                    resultLocNotItaly = await dbLayer.searchIdOfLocationNotItalyFromDb(id_cardsAgency, locationReal);
                    console.log(resultLoc);
                }    
                
                if (fields.languagesFinal) {
                    let finalLocation = fields.languagesFinal;
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
                
                    languagesArr = await dbLayer.searchIdOfLanguagesFromDb(id_cardsAgency, locationReal);
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


                
                let mainClientReal = [];

                if (files.mainClient) {
                    for (let a = 0; a < files.mainClient.length; a++) {
                        let filePathMain = files.mainClient[a].filepath;
                        let fileBufferMain = fs.readFileSync(filePathMain);
                        let fileBase64Main = fileBufferMain.toString('base64');
                        let resultMain = await dbLayer.createPageMainClientCards(fileBase64Main, fields.mainCnames[a]);
                        console.log(resultMain);
                        mainClientReal.push(resultMain);
                    }
                }

                let referralClientReal = [];
                let refClient = {};

                if (files.photoRefClient) {
                    for (let x = 0; x < files.photoRefClient.length; x++) {
                        let filePathRef = files.photoRefClient[x].filepath;
                        let fileBufferRef = fs.readFileSync(filePathRef);
                        let fileBase64Ref = fileBufferRef.toString('base64');
                        refClient = {
                            name: fields.nameRefClient[x],
                            surname: fields.surnameRefClient[x],
                            workAs: fields.professionRefClient[x],
                            photo: fileBase64Ref,
                            workWhere: fields.mainCrefClient[x],
                        }
                        let resultRefClient = await dbLayer.createReferralClient(refClient);
                        console.log(resultRefClient);
                        referralClientReal.push(await dbLayer.getIdReferralClient(id_cardsAgency, fields.nameRefClient[x]));
                        console.log("ARRAY: ", referralClientReal);
                    }
                }

                // console.log(JSON.stringify(files));

                let user = {
                    name: fields.agencyName?.[0] || null,
                    founderName: citys,
                    numberOfEmployees: fields.numberOfEmployees?.[0] || null,
                    foundationYear: fields.foundationYear?.[0] || null,
                    agencyType: fields.agencyType?.[0] || null,
                    logo: fileBase64,
                    managedBilling: fields.managedBilling?.[0] || null,
                    awareness: fields.awareness ? true : false,
                    conversion: fields.conversion ? true : false,
                    conversion: fields.consideration ? true : false,
                    retention: fields.retention ? true : false,
                    advocacy: fields.advocacy ? true : false,
                    website: fields.agencyWebsite?.[0] || null,
                    linkedinLink: fields.agencyLinkedin?.[0] || null,
                    facebookLink: fields.agencyFacebook?.[0] || null,
                    email: fields.agencyEmail?.[0] || null,
                    locations: resultLoc,
                    mainServices: resultMainS,
                    distinctiveServices: resultDisS,
                    managedMedia: resultMediS,
                    managedPlatform: resultPlatS,
                    referralClient: referralClientReal,
                    brochure: fields.brochure?.[0] || null,
                    caseStudy: fields.caseStudy?.[0] || null,
                    clientLogos: mainClientReal, 
                    planning: fields.planning ? true : false,
                    project: fields.project ? true : false,
                    task: fields.task ? true : false,
                    platform: fields.platform ? true : false,
                    reporting: fields.reporting ? true : false,
                    dataAnalysis: fields.dataAnalysis ? true : false,
                    adServer: fields.adServer ? true : false,
                    AdVerification: fields.AdVerification ? true : false,
                    locationsNotItaly: resultLocNotItaly,
                    languages: languagesArr,
                    sales: fields.sales,
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

exports.postEdit = async function(req,res) {
    let id_cardsAgency = Array.from({ length: 1000 }, (_, i) => i);
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
                let resultLocNotIta = [];
                let resultLang = [];
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

                if (fields.finalLocationNoIta) {
                    let finalLocation = fields.finalLocationNoIta;
                    let locationsArray = finalLocation[0].includes(',')
                        ? finalLocation[0].split(',')
                        : [finalLocation[0]];

                    console.log(locationsArray);
                
                    let locationReal = locationsArray.map(part =>
                        part
                            .trim()
                            .split(/[\s\-]/)
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                            .join(' ')
                    );
                
                    console.log("Città separate: ", locationReal);
                
                    resultLocNotIta = await dbLayer.searchIdOfLocationNotItalyFromDb(id_cardsAgency, locationReal);
                    console.log(resultLocNotIta);
                }  

                if (fields.finalLang) {
                    let finalLocation = fields.finalLang;
                    let locationsArray = finalLocation[0].includes(',')
                        ? finalLocation[0].split(',')
                        : [finalLocation[0]];

                    console.log(locationsArray);
                
                    let locationReal = locationsArray.map(part =>
                        part
                            .trim()
                            .split(/[\s\-]/)
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                            .join(' ')
                    );
                
                    console.log("Città separate: ", locationReal);
                
                    resultLang = await dbLayer.searchIdOfLanguagesFromDb(id_cardsAgency, locationReal);
                    console.log(resultLang);
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
                        retention: fields.retention ? true : false,
                        advocacy: fields.advocacy ? true : false,
                        sales: fields.sales,
                        locationsNotItaly: (resultLocNotIta.length !== 0) ? resultLocNotIta : undefined,
                        languages: (resultLang.length !== 0) ? resultLang : undefined,
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

                cache.clearCacheEditPage();
                cache.clearCacheMyPage();
                cache.clearCacheListing();

                let resp = "Contenuto inviato al db"
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(resp);

            }
        } catch(err) {
            console.log(err);
        }
    })
    return
}