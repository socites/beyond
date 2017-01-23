module.exports = require('async')(function *(resolve, reject, overwrites) {
    "use strict";

    let output = {};
    for (let moduleID of overwrites.keys) {

        let statics = overwrites.items[moduleID].static;
        if (!statics) continue;

        let library;
        let module = (function (moduleID) {

            moduleID = moduleID.split('/');
            library = moduleID.shift();
            let module = moduleID.join('/');

            if (!module) {
                module = 'main';
            }

            return module;

        })(moduleID);

        if (!overwrites[library]) {
            overwrites[library] = {};
        }
        if (!overwrites[library][module]) {
            overwrites[library][module] = [];
        }

        for (let key of statics.keys) {
            overwrites[library][module].push(key);
        }

    }

    resolve(output);

});
