module.exports = require('async')(function *(resolve, reject, overwrites) {
    "use strict";

    let output = {};
    for (let moduleID of overwrites.keys) {

        let statics = overwrites.items[moduleID].static;
        if (!statics) continue;

        let module = moduleID.split('/');
        let libraryName = module.shift();
        module = module.join('/');
        if (!module) module = 'main';

        if (!overwrites[libraryName]) {
            overwrites[libraryName] = {};
        }
        if (!overwrites[libraryName][module]) {
            overwrites[libraryName][module] = [];
        }

        for (let key of statics.keys) overwrites[libraryName][module].push(key);

    }

    resolve(output);

});
