// compile application static overwrites
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    let copy = require('../fs/copy');

    if (application.build.custom && application.build.custom.path) {

        let path = application.build.custom.path;
        if (!path) path = '';
        pathJS = require('path').join(pathJS, path);

    }

    console.log('\tbuiling overwrites'.green);

    yield application.overwrites.initialise();
    for (let module of application.overwrites.keys) {

        let overwrites = application.overwrites.items[module];
        if (!overwrites.static) continue;

        module = module.split('/');
        let library = module.shift();
        module = module.join('/');
        if (!module) module = 'main';

        for (let resource of overwrites.static.keys) {

            let overwrite = overwrites.static.items[resource];

            resource = yield application.client.custom.static(library, module, resource);
            let target = require('path').join(pathJS, 'custom', library, module, 'static', overwrite);

            copy.file(resource.file, target);

        }

    }

    resolve();

});
