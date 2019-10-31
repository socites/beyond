module.exports = new (function () {

    let cache = new Map();
    let times = [];
    let EXPIRATION = 300000; // 5 min of expiration time

    this.insert = function (socketId, key, value) {

        key = `${socketId}.${key}`;
        if (cache.has(key)) {
            console.error(`Cache key "${key}" already set`);
            this.update(socketId, key, value);
            return;
        }

        cache.set(key, value);
        times.push({'key': key, 'time': Date.now()});

    };

    this.update = function (socketId, key, value) {

        key = `${socketId}.${key}`;
        if (!cache.has(key)) console.warn(`Cache key "${key}" not set`);
        cache.set(key, value);

    };

    this.has = (socketId, key) => cache.has(`${socketId}.${key}`);
    this.get = (socketId, key) => cache.get(`${socketId}.${key}`);


    // Cleaning process
    setInterval(function () {

        if (!times.length) return;

        let expired = Date.now() - EXPIRATION;

        let rq = times[0];
        if (rq.time > expired) {
            return;
        }

        // Expire item
        times.shift();
        cache.delete(rq.key);

    }, 1000);

})();
