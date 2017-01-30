module.exports = require('async')(function *(resolve, reject, overwrites) {
    "use strict";

    let output = {};
    for (let moduleID of overwrites.keys) {

        let statics = overwrites.items[moduleID].static;
        if (!statics) continue;

        let library;
        let module = (function (moduleID) {

            moduleID = moduleID.split('/');
            moduleID.shift(); // Remove the /libraries
            library = moduleID.shift(); // Get the library name
            let module = moduleID.join('/');

            if (!module) {
                module = 'main';
            }

            return module;

        })(moduleID);

        if (!output[library]) {
            output[library] = {};
        }
        if (!output[library][module]) {
            output[library][module] = [];
        }

        for (let key of statics.keys) {
            output[library][module].push(key);
        }

    }

    resolve(output);

});
