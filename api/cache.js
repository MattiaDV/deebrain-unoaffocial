const NodeCache = require('node-cache');
const myCache = new NodeCache();

exports.getDataFromCache = function() {
    const data = myCache.get('utente');
    return data || null;
};

exports.saveDataToCache = function(data) {
    myCache.set('utente', data, 3600);
};

exports.getDataFromCacheMyPage = function() {
    const data = myCache.get('ut');
    return data || null;
};

exports.saveDataToCacheMyPage = function(data) {
    myCache.set('ut', data, 3600);
};

exports.getDataFromCacheEditPage = function() {
    const data = myCache.get('edit');
    return data || null;
};

exports.saveDataToCacheEditPage = function(data) {
    myCache.set('edit', data, 3600);
};

exports.clearCacheMyPage = function() {
    myCache.del('ut');
}

exports.clearCacheListing = function() {
    myCache.del('utente');
}

exports.clearCacheEditPage= function() {
    myCache.del('edit');
}