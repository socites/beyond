module.exports = require('async')(function *(resolve, reject, url, modules, specs) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    let parsed = require('./parser')(url, modules, specs);
    if (parsed.error) {
        resolve(new Resource({'404': parsed.error}));
        return;
    }

    let application = parsed.application;
    let language = parsed.language;
    let resource = parsed.resource;
    let types = require(require('path').join(require('main.lib'), 'types'));

    let applications = modules.applications;
    application = applications.items[application];

    if (!resource) resource = 'index.html';

    // Check if the resource is the config.js or the start.js
    if (resource === 'config.js') {
        resource = yield application.client.script('config.js', language, specs);
        resolve(resource);
        return;
    }
    else if (resource === 'start.js') {
        resource = yield application.client.script('start.js', language, specs);
        resolve(resource);
        return;
    }

    // Check if the resource is a custom script
    let custom = yield require('./custom.js')(application, resource, language, specs);
    if (custom) {
        resolve(custom);
        return;
    }

    // Check if the resource is a static resource of the application
    let statics = yield application.static.resource(resource, language, specs);
    if (statics) {
        resolve(statics);
        return;
    }

    let moduleID, file, extname, type;

    if (resource.indexOf('/static/') === -1 && resource.substr(0, 7) !== 'static/') {

        extname = require('path').extname(resource);
        resource = resource.substr(0, resource.length - extname.length);

        if (!extname) {

            // Any other resource in an application must return the index.html content
            resolve(yield application.static.resource('index.html', language, specs));
            return;

        }

        if (['.js', '.html'].indexOf(extname) === -1) {
            resolve();
            return;
        }

        resource = resource.split('/');
        type = resource.pop();

        if (!type) {
            resolve(new Resource({'404': 'Type not defined.'}));
            return;
        }

        if (!types.types.has(type)) {
            resolve(new Resource({'404': 'Type "' + type + '" does not exist.'}));
            return;
        }

        moduleID = resource.join('/');

    }
    else {

        resource = resource.split('/static/');
        file = resource[1];
        moduleID = resource[0];

    }

    let module = yield application.modules.module(moduleID);
    if (!module) {
        resolve(new Resource({'404': 'Module "' + moduleID + '" does not exist.'}));
        return;
    }

    yield module.initialise();

    if (file) {

        if (!module.static) {
            resolve(new Resource({'404': 'Module "' + moduleID + '" does not have static resources.'}));
            return;
        }

        let resource = yield module.static.resource(file);
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
