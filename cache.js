const NodeCache = require('node-cache');
const myCache = new NodeCache();

exports.getDataFromCache = function() {
    const data = myCache.get('utente');
    return data || null;
};

exports.saveDataToCache = function(data) {
    myCache.set('utente', data, 3600);
};
