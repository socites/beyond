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

    let file;
    let extname;

    if (resource.indexOf('/static/') === -1 && resource.substr(0, 7) !== 'static/') {

        extname = require('path').extname(resource);
        if (!extname) {

            // Any other resource in an application must return the index.html content
            resolve(yield application.static.resource('index.html', language, specs));
            return;

        }

        if (['.js', '.html'].indexOf(extname) === -1) {

            resolve();
            return;

        }

        resource = resource.substr(0, resource.length - extname.length);

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

    let module = yield application.modules.module(resource);
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

            if (extname === '.js') {

                if (!module.code) {
                    resolve();
                    return;
                }

                resource = yield module.code(language);

                if (!resource) {
                    resolve();
                    return;
                }

                resolve(resource);
                return;

            }
            else if (extname === '.html') {

                if (!module.polymer) {
                    resolve();
                    return;
                }

                resource = yield module.polymer(language);

                if (!resource) {
                    resolve();
                    return;
                }

                resolve(resource);
                return;

            }

            resolve();
            return;

        }

    }

    resolve();

});
