module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    let ids = params.ids;
    if (!ids || !(ids instanceof Array)) {
        throw new Error('Invalid parameter ids');
    }

    let modules = context.modules;
    let applications = modules.applications.items;

    let output = {};

    for (var name in applications) {

        if (ids.indexOf(name) === -1) {
            continue;
        }

        let application = applications[name];
        if (!application.valid) {
            continue;
        }

        output[name] = {
            'name': application.name,
            'dirname': application.dirname
        };

    }

    resolve(output);

});
