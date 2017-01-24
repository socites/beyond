module.exports = require('async')(function *(resolve, reject, module, processor, config) {
    "use strict";

    let Finder = require('finder');
    let error = require('../error.js')(module, 'page');

    if (typeof config === 'string') {
        config = {'files': [config]};
    }

    if (typeof config !== 'object') {
        reject(error('invalid processor "' + processor + '" configuration'));
        return;
    }

    let files = (typeof config.files === 'string') ? [config.files] : config.files;
    if (!(files instanceof Array)) {
        reject(error('invalid files specification on processor "' + processor + '" configuration'));
        return;
    }

    let path = (config.path) ? config.path : './';
    path = require('path').join(module.dirname, path);

    let finder = new Finder(path, {'list': files, 'usekey': 'relative.file'});
    try {
        yield finder.process();
    }
    catch (exc) {
        reject(error(exc.message));
        return;
    }

    resolve(finder.items);

});
