import Odoo from 'node-odoo'

const connectionDb = new Odoo({
    host: 'localhost',
    port: 8069,
    database: 'addons-listing',
    username: 'admin',
    password: 'admin',
});

connectionDb.connect(function(err) {
    if (err) {
        console.error("Connessione non riuscita: ", err);
    } else {
        console.log("Connessione al database riuscita");
    }


    // Funzione per prelevare tutti i nomi delle location presenti nel database
    // let id_array_location = Array.from({ length: 440 }, (_, i) => i);

    // var params_location = id_array_location;
      
    // connectionDb.get('location_listing', params_location, function (err, partners) {
    //     if (err) { 
    //         console.error("Errore nella ricerda delle location presenti nel database: " + JSON.stringify(err)); 
    //     }
    //     for (let x = 0; x < partners.length; x++) {
    //         if (partners[x].name !== false) {
    //             console.log(partners[x].name);
    //         }
    //     }
    // });

    // // Funzione per restituire tutti i main service presenti nel database
    // let id_array_main_service = Array.from({ length: 440 }, (_, i) => i);

    // var params_main_service = id_array_main_service;

    // connectionDb.get('main_services', params_main_service, function(err, main_serv) {
    //     if (err) {
    //         console.error("Errore nella ricerda dei main service presenti sul database: " + JSON.stringify(err));
    //     }
    //     for (let x = 0; x < main_serv.length; x++) {
    //         if (main_serv[x].name !== false) {
    //             console.log(main_serv[x].name);
    //         }
    //     }
    // })

    // // Funzione per restituire tutti i distinctive service presenti nel database
    // let id_array_distinctive_service = Array.from({ length: 440 }, (_, i) => i);

    // var params_distinctive_service = id_array_distinctive_service;

    // connectionDb.get('distinctive_services', params_distinctive_service, function(err, distinctive_service) {
    //     if (err) {
    //         console.error("Errore nella ricerda dei distinctive service presenti sul database: " + JSON.stringify(err));
    //     }
    //     for (let x = 0; x < distinctive_service.length; x++) {
    //         if (distinctive_service[x].name !== false) {
    //             console.log(distinctive_service[x].name);
    //         }
    //     }
    // })

    // // Funzione per restituire tutti i managed media presenti nel database
    // let id_array_managed_media = Array.from({ length: 440 }, (_, i) => i);

    // var params_managed_media = id_array_managed_media;

    // connectionDb.get('managed_media', params_managed_media, function(err, managed_media) {
    //     if (err) {
    //         console.error("Errore nella ricerda dei managed media presenti sul database: " + JSON.stringify(err));
    //     }
    //     for (let x = 0; x < managed_media.length; x++) {
    //         if (managed_media[x].name !== false) {
    //             console.log(managed_media[x].name);
    //         }
    //     }
    // })

    // // Funzione per restituire tutti i managed platform presenti nel database
    // let id_array_managed_platform = Array.from({ length: 440 }, (_, i) => i);

    // var params_managed_platform = id_array_managed_platform;

    // connectionDb.get('managed_platform', params_managed_platform, function(err, managed_platform) {
    //     if (err) {
    //         console.error("Errore nella ricerda dei managed platform presenti sul database: " + JSON.stringify(err));
    //     }
    //     for (let x = 0; x < managed_platform.length; x++) {
    //         if (managed_platform[x].name !== false) {
    //             console.log(managed_platform[x].name);
    //         }
    //     }
    // })
    
});

export default connectionDb;