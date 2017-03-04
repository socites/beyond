module.exports = require('async')(function *(resolve, reject, module, specs, path) {
    "use strict";

    let fs = require('co-fs');
    let save = require('../../../../fs/save');

    let json = {};

    let languages = specs.languages;
    if (typeof languages === 'string') {
        languages = [languages];
    }
    if (!(languages instanceof Array) || !languages.length) {
        languages = ['eng', 'spa'];
    }

    yield require('./types.js')(module, languages, json, path);
    yield require('./statics.js')(module, json, path);
    yield require('./start.js')(module, json, path);
    yield require('./custom.js')(module, json, path);

    // saving module.json file
    if (specs.mode === 'beyond') {

        let target = (module.path === '.') ? 'main' : module.path;
        target = require('path').join(
            path,
            target,
            'module.json');

        yield save(target, JSON.stringify(json));

    }

    resolve();

});
