var async = require('async');

module.exports = function (application, template) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    this.script = require('./script')(application);

    this.static = async(function *(resolve, reject, library, module, resource) {

        if (!template) {
            resolve();
            return;
        }

        let overwrites = template.overwrites;

        let moduleID;

        if (module === 'main') moduleID = library;
        else moduleID = require('url-join')(library, module);

        if (!overwrites.items[moduleID]) {
            resolve();
            return;
        }

        module = overwrites.items[moduleID];
        let dirname = module.dirname;
        let statics = module.static;

        if (!statics) {
            resolve();
            return;
        }

        resource = statics.items[resource];
        if (!resource) {
            resolve();
            return;
        }

        let file = require('path').join(dirname, resource);

        let fs = require('co-fs');
        if (!(yield fs.exists(file))) {
            resolve();
            return;
        }

        resource = new Resource({'file': file});
        resolve(resource);

    }, this);

};
