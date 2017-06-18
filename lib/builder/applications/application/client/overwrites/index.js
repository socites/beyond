// compile application static overwrites
module.exports = require('async')(function *(resolve, reject, application, path, language) {
    "use strict";

    let copy = require('../../../../fs/copy');

    console.log('\tcopying static overwrites'.green);

    let template = application.template;

    yield template.overwrites.initialise();

    for (let module of template.overwrites.keys) {

        let overwrites = template.overwrites.items[module];
        if (!overwrites.static) continue;

        module = module.split('/');
        if (module.shift() !== 'libraries') {
            throw new Error('Invalid library on overwrite "' + module + '"' + ' on application' + application.name);
        }
        let library = module.shift();

        module = module.join('/');
        if (!module) module = 'main';

        for (let resource of overwrites.static.keys) {

            let overwrite = overwrites.static.items[resource];
            overwrite = yield application.client.custom.static(library, module, resource);
            let target = require('path').join(path, 'custom', library, module, 'static', resource);

            copy.file(overwrite.file, target);

        }

    }

    resolve();

});
