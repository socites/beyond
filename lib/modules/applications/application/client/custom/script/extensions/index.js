/**
 * Returns the script of all the start scripts of the modules of the application
 * and the modules of the libraries imported by the application
 *
 * @param application
 * @param overwrites
 * @param order
 */
module.exports = require('async')(function *(resolve, reject, application, module, language) {
    "use strict";

    let async = require('async');
    let template = application.template;

    // remove the 'libraries/' from the module.ID, the extensions are always referring to libraries
    // and that is why 'libraries/' is not required and neither used
    let extending = module.ID.substr(10);

    let items = {}, keys = [];
    let modules = application.modules;
    yield modules.process();

    let append = async(function*(resolve, reject, module) {

        yield module.initialise();

        let extension = module.extends.items[extending];
        if (extension) {
            items[module.ID] = module;
            keys.push(module.ID);
        }

        resolve();
        return;

    });

    for (let module of modules.keys) {

        module = modules.items[module];
        yield append(module);

    }

    let libraries = application.libraries;
    for (let name of libraries.keys) {

        let library = libraries.items[name];
        let modules = library.modules;
        yield modules.process();

        for (let key of modules.keys) {

            let module = modules.items[key];
            yield append(module);

        }

    }

    let script = '';
    for (let key of keys) {

        let extender = items[key];
        let overwrites = require('./overwrites')(template.overwrites, module.ID, extender.ID);

        let extension = extender.extends.items[extending];
        let code = yield extension.code(language, overwrites);
        if (code && code.content) script += code.content + '\n\n';

    }

    resolve(script);

});
