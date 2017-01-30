module.exports = require('async')(function *(resolve, reject, application, resource, language, specs) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    resource = resource.split('/');
    let custom = resource.shift();

    if (custom !== 'custom') {
        resolve();
        return;
    }

    if (resource.length < 2) {
        resolve(new Resource({'404': 'Invalid custom resource. URL is not valid.'}));
        return;
    }

    let name = resource.shift();
    let library = application.libraries.items[name];
    if (!library) {

        resolve(new Resource({
            '404': 'Custom resource not found. Library "' + name +
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

        resource = yield application.client.custom.static(library.name, module, resource);
        if (!resource) {
            resolve(new Resource({'404': 'Custom resource does not exist.'}));
            return;
        }

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
        if (!resource) {
            resolve(new Resource({'404': 'Custom resource does not exist.'}));
            return;
        }

        resolve(resource);

    }

});
