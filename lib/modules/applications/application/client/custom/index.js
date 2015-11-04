var async = require('async');

module.exports = function (application, overwrites) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    this.script = require('./script')(application, overwrites);

    this.static = async(function *(resolve, reject, resource) {

        let keys = overwrites.static.keys;
        let found;
        for (let key of keys) {

            if (this.overwrites.static.items[key] === resource) {
                found = true;
                break;
            }

        }

        if (!found) {
            resolve();
            return;
        }

        let file = require('path').join(overwrites.static.dirname, resource);
        let fs = require('co-fs');
        if (!(yield fs.exists(file))) {
            resolve();
            return;
        }

        resource = new Resource({'file': file});
        resolve(resource);

    }, this);

};
