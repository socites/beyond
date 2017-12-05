module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    let modules = context.modules;
    let applications = modules.applications.items;

    let output = [];

    for (var name in applications) {

        let application = applications[name];
        if (!application.valid) {
            continue;
        }

        output.push({
            'name': application.name,
            'dirname': application.dirname
        });

    }

    resolve(output);

});
