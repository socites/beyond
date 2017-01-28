module.exports = require('async')(function *(resolve, reject, application, path, runtime) {
    "use strict";

    const filename = 'module.json';
    let Module = require('path').join(require('main.lib'), 'modules/module');
    Module = require(Module);

    let fs = require('co-fs');

    let config = require('path').join(application.dirname, path, filename);
    let dirname = require('path').dirname(config);

    try {
        config = yield fs.readFile(config, {'encoding': 'UTF8'});
        config = JSON.parse(config);
    }
    catch (exc) {
        reject(new Error('invalid module configuration: ' + path + '. ' + exc.message));
        return;
    }

    let specs = {'application': application, 'path': path, 'dirname': dirname};
    let module = new Module(config, specs, runtime);

    resolve(module);

});
