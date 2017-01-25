module.exports = function (application) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, library, module, language) {

        library = application.libraries.items[library];
        if (!library) {
            resolve();
            return;
        }

        module = yield library.modules.module(module);
        if (!module) {
            resolve();
            return;
        }

        yield module.initialise();

        // custom code is composed by the custom code specified in the module
        // plus the extensions of the module

        let custom = yield require('./custom')(application, module, language);
        let extensions = yield require('./extensions')(application, module, language);

        if (!custom && !extensions) {
            resolve();
            return;
        }

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

        let content = '';
        content += require('./order')(application, module);
        if (extensions) content += extensions + '\n\n';
        if (custom) content += custom.content;

        let resource = new Resource({'content': content, 'type': 'javascript'});

        resolve(resource);

    });

};
