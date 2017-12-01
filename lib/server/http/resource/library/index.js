module.exports = require('async')(function *(resolve, reject, url, modules, specs) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    let languages = require('../languages.js');
    let types = require(require('path').join(require('main.lib'), 'types'));

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

    let moduleID, file, extname, language, type;

    if (resource.indexOf('/static/') === -1 && resource.substr(0, 7) !== 'static/') {

        extname = require('path').extname(resource);
        resource = resource.substr(0, resource.length - extname.length);

        if (['.js', '.html'].indexOf(extname) === -1) {
            resolve();
            return;
        }

        resource = resource.split('/');
        language = resource.pop();

        if (languages.indexOf(language) === -1) {
            type = language;
            language = undefined;
        }
        else {
            type = resource.pop();
        }

        if (!type) {
            resolve(new Resource({'404': 'Type not defined.'}));
            return;
        }

        if (type === 'custom') {
            resolve(new Resource({'404': 'Custom are application resources.'}));
            return;
        }

        if (!types.types.has(type)) {
            resolve(new Resource({'404': 'Type "' + type + '" does not exist.'}));
            return;
        }

        moduleID = resource.join('/');

    }
    else {

        if (resource.substr(0, 7) === 'static/') {
            file = resource.substr(7);
            moduleID = '.';
        }
        else {

            resource = resource.split('/static/');
            file = resource[1];
            moduleID = resource[0];

        }

    }

    if (!moduleID) {
        resolve(new Resource({'404': 'Module not specified.'}));
        return;
    }

    let module = yield version.modules.module(moduleID);
    if (!module && moduleID === 'main') {
        moduleID = '.';
        module = yield version.modules.module(moduleID);
    }

    if (!module) {
        resolve(new Resource({'404': 'Module "' + resource + '" does not exist.'}));
        return;
    }

    yield module.initialise();

    if (file) {

        if (!module.static) {
            resolve(new Resource({'404': 'Module "' + module.ID + '" does not have static resources.'}));
            return;
        }

        resource = yield module.static.resource(file);
        resolve(resource);

    }
    else {

        if (!module.types[type] || module.types[type].extname !== extname) {
            resolve();
            return;
        }

        let output = yield module.types[type].process(language);
        resolve(output);

    }

});
