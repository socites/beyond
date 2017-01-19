var async = require('async');
var Resource = require('path').join(require('main.lib'), 'resource');
Resource = require(Resource);

module.exports = async(function *(resolve, reject, url, modules, specs) {
    "use strict";

    let parsed = require('./parser')(url, modules, specs);

    if (parsed.error) {
        resolve(new Resource({'404': parsed.error}));
        return;
    }

    let application = parsed.application;
    let language = parsed.language;
    let resource = parsed.resource;

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

    let module, file, extname, type;

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

        if (['code', 'page', 'control'].indexOf(type) === -1) {
            resolve(new Resource({'404': 'Type "' + type + '" does not exist.'}));
            return;
        }

        module = resource.join('/');

    }
    else {

        resource = resource.split('/static/');
        file = resource[1];
        module = resource[0];

    }

    module = yield application.modules.module(module);
    if (module) {

        yield module.initialise();

        if (file) {

            if (!module.static) {
                resolve();
                return;
            }

            resource = yield module.static.resource(file);
            resolve(resource);
            return;

        }
        else {

            if (type === 'code' && extname === '.js') {

                if (!module.code) {
                    resolve();
                    return;
                }

                let output = yield module.code(language);

                if (!output) {
                    resolve();
                    return;
                }

                resolve(output);
                return;

            }
            else if (type === 'control' && extname === '.html') {

                if (!module.polymer) {
                    resolve();
                    return;
                }

                let output = yield module.polymer(language);

                if (!output) {
                    resolve();
                    return;
                }

                resolve(output);
                return;

            }

            resolve();
            return;

        }

    }

    resolve();

});
