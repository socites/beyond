module.exports = function (template) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, module, processors, config, language) {
        "use strict";

        let error = require('../../error.js')(module);

        let files;
        files = yield (require('./files.js')(module, 'txt', config));
        files = (template) ? files.concat(yield template.getCustomOverwrites(module, 'txt', error)) : files;

        let texts = yield processors.txt(files, language);
        resolve(texts);

    });

};
