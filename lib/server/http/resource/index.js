var async = require('async');
var Resource = require('path').join(require('main.lib'), 'resource');
Resource = require(Resource);

module.exports = async(function *(resolve, reject, url, modules, specs) {
    "use strict";

    url = url.substr(1);
    let resource;

    resource = yield require('./library')(url, modules, specs);
    if (resource) {
        resolve(resource);
        return;
    }

    resource = yield require('./application')(url, modules, specs);
    if (resource) {
        resolve(resource);
        return;
    }

    resource = new Resource({'404': 'Resource not found.'});
    resolve(resource);

});
