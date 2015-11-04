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

    if (resource.indexOf('static') === 0) {

        resource.shift();
        resource = resource.join('/');

        resource = yield application.client.custom.static(resource);
        resolve(resource);

    }
    else {

        let libname = resource.shift();
        let library = application.libraries.items[libname];
        if (!library) {

            resolve(new Resource({
                '404': 'Custom resource not found. Library "' + libname +
                '" does not exist or it is not being imported by the application.'
            }));
            return;

        }

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
