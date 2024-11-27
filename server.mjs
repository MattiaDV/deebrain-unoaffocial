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
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
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

server.listen(3000, "192.168.1.14", () => {
    console.log("Listening");
});
