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

    let id_array = Array.from({ length: 205 }, (_, i) => i);

    var params = {
        ids: [110,111,112,113,114],
    };
      
    connectionDb.get('location_listing', params, function (err, partners) {
        if (err) { return console.log(err); }
        console.log(partners);
    });
});

export default connectionDb;