module.exports = require('async')(function *(resolve, reject, module, type, processor, config) {
    "use strict";

    let Finder = require('finder');
    let error = require('./error.js')(module, type, processor);

    if (typeof config === 'string') {
        config = {'files': [config]};
    }
    if (config instanceof Array) {
        config = {'files': config};
    }
    if (typeof config !== 'object') {
        reject(error('Invalid processor "' + processor + '" configuration on type "' + type + '"'));
        return;
    }

    let files = (typeof config.files === 'string') ? [config.files] : config.files;
    if (!(files instanceof Array)) {
        reject(error('Invalid files specification on processor "' + processor +
            '" configuration on type "' + type + '"'));
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

    files = [];
    for (let key in finder.items) {
        files.push(finder.items[key]);
    }

    resolve(files);

});
