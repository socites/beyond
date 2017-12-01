module.exports = function (template) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, module, processor, process, config, finder, minify, error) {
        "use strict";

        let files;
        files = (template && processor === 'less') ? yield template.getLessModules(module, error) : [];
        files = files.concat(yield (finder(module, 'code', processor, config)));

        let styles = yield process(module, files, true, error);

        resolve(output);

    });

};
