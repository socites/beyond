module.exports = function (socketId) {

    let cache;
    cache = require('./cache.js');

    this.insert = (key, value) => cache.insert(socketId, key, value);
    this.update = (key, value) => cache.update(socketId, key, value);
    this.has = key => cache.has(socketId, key);
    this.get = (key) => cache.get(socketId, key);

};
