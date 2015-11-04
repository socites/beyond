var async = require('async');
var Resource = require('path').join(require('main.lib'), 'resource');
Resource = require(Resource);

module.exports = async(function *(resolve, reject, url, modules, specs) {
    "use strict";

    url = url.split('/');
    if (url.shift() !== 'libraries') {
        resolve();
        return;
    }

    if (url.length < 3) {
        resolve();
        return;
    }

    let library = url.shift();
    let version = url.shift();
    if (!library || !version) {
        resolve();
        return;
    }

    if (!modules.libraries.items[library]) {
        resolve(new Resource({'404': 'Library "' + library + '" does not exist'}));
        return;
    }
    library = modules.libraries.items[library];

    if (!library.versions.items[version]) {
        resolve(new Resource({'404': 'Version "' + version + '" of library "' + library.name + '" does not exist'}));
        return;
    }
    version = library.versions.items[version];

    let resource = url.join('/');

    let file;
    if (resource.indexOf('/static/') === -1 && resource.substr(0, 7) !== 'static/') {

        if (require('path').extname(url) !== '.js') {
            resolve();
            return;
        }

        resource = resource.substr(0, resource.length - 3);

    }
    else {

        if (resource.substr(0, 7) === 'static/') {
            file = resource.substr(7);
            resource = '.';
        }
        else {

            resource = resource.split('/static/');
            file = resource[1];
            resource = resource[0];

        }

    }

    let module = yield version.modules.module(resource);

    if (!module && !file && resource === 'main')
        module = yield version.modules.module('.');

    if (!module) {
        resolve();
        return;
    }

    yield module.initialise();

    if (file) {

        let resource = yield module.static.resource(file);
        resolve(resource);

    }
    else {

        if (!module.code) {
            resolve();
            return;
        }

        let resource = yield module.code();

        if (resource) {
            resolve(resource);
            return;
        }

    }

});
