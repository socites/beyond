var async = require('async');

var Resource = require('path').join(require('main.lib'), 'resource');
Resource = require(Resource);

module.exports = async(function *(resolve, reject, application, resource, language, specs) {
    "use strict";

    resource = resource.split('/');
    let custom = resource.shift();

    if (custom !== 'custom') {
        resolve();
        return;
    }

    if (resource.length < 2) {
        resolve();
        return;
    }

    let libname = resource.shift();
    let library = application.libraries.items[libname];
    if (!library) {

        resolve(new Resource({
            '404': 'Custom resource not found. Library "' + libname +
            '" does not exist or it is not being imported by the application.'
        }));
        return;

    }

    if (resource.indexOf('static') !== -1) {

        resource = resource.join('/');
        resource = resource.split('/static/');

        let module = resource[0];
        if (!module) module = 'main';
        resource = resource[1];

        resource = yield application.client.custom.static(libname, module, resource);
        resolve(resource);

    }
    else {

        resource = resource.join('/');
        if (require('path').extname(resource) !== '.js') {
            resolve(new Resource({'404': 'Custom resource is not valid.'}));
            return;
        }

        let module = resource.substr(0, resource.length - 3);
        if (module === 'main') module = '.';
        module = yield library.modules.module(module);

        if (!module) {
            resolve(new Resource({'404': 'Module not found.'}));
            return;
        }

        // resource is a script
        resource = yield application.client.custom.script(library.name, module.path, language);
        resolve(resource);

    }

});
