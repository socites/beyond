module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    let modules = context.modules;
    let libraries = modules.libraries.items;

    let output = [];

    for (var name in libraries) {

        let library = libraries[name];
        if (!library.valid) {
            continue;
        }

        output.push(library.name);

    }

    resolve(output);

});
