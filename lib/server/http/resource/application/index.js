var async = require('async');
var Resource = require('path').join(require('main.lib'), 'resource');
Resource = require(Resource);

module.exports = async(function *(resolve, reject, url, modules, specs) {
    "use strict";

    url = url.split('/');
    let application = url.shift();
    if (!application || application === 'libraries') {
        resolve();
        return;
    }

    let applications = modules.applications;
    if (applications.keys.indexOf(application) === -1) {

        let message = 'Application "' + application + '" does not exists or it is not properly configured.';
        let resource = new Resource({'404': message});
        resolve(resource);
        return;

    }

    let language = url.shift();
    if (!language || language.length !== 2) {
        resolve(new Resource({'404': 'Language not set.'}));
        return;
    }

    application = applications.items[application];

    let resource = url.join('/');
    let controls = yield application.controls;

    if (!resource) resource = 'index.html';


    if (resource !== 'index.html') {

        for (let moduleID in controls) {

            let control = controls[moduleID];

            let pathname = '/' + resource;
            if (typeof control === 'string' && control === pathname) {
                resource = 'index.html';
                break;
            }

            if (typeof control === 'object' && control.pathname === pathname) {
                resource = 'index.html';
                break;
            }

        }

    }

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

        extname = require('path').extname(url);
        if (['.js', '.polymer'].indexOf(extname) === -1) {
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
    if (!module) {
        resolve();
        return;
    }

    yield module.initialise();

    if (file) {

        if (!module.static) {
            resolve();
            return;
        }

        let resource = yield module.static.resource(file);
        resolve(resource);
        return;

    }
    else {

        if (extname === '.js') {

            if (!module.code) {
                resolve();
                return;
            }

            let resource = yield module.code(language);

            if (!resource) {
                resolve();
                return;
            }

            resolve(resource);
            return;

        }
        else if (extname === '.polymer') {

            if (!module.polymer) {
                resolve();
                return;
            }

            let resource = yield module.polymer(language);

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

});
