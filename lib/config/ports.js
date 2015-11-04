module.exports = function (config) {
    "use strict";

    let http = 3010;
    Object.defineProperty(this, 'http', {
        'get': function () {
            return http;
        }
    });

    let rpc = 3011;
    Object.defineProperty(this, 'rpc', {
        'get': function () {
            return rpc;
        }
    });

    if (typeof config !== 'object') config = {};
    if (config.http) http = config.http;
    if (config.rpc) rpc = config.rpc;

};
