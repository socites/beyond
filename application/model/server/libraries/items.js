module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    let ids = params.ids;
    if (!ids || !(ids instanceof Array)) {
        throw new Error('Invalid parameter ids');
    }

    let modules = context.modules;
    let libraries = modules.libraries.items;

    let output = {};

    for (var name in libraries) {

        if (ids.indexOf(name) === -1) {
            continue;
        }

        let library = libraries[name];
        if (!library.valid) {
            continue;
        }

        output[name] = {
            'name': library.name,
            'dirname': library.dirname
        };

    }

    resolve(output);

});
