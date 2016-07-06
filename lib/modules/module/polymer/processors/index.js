module.exports = function (module) {
    "use strict";

    let error = require('./error.js');

    return {
        'html': new (require('./html.js'))(module, error(module, 'html')),
        'js': new (require('./js.js'))(module, error(module, 'js')),
        'dependencies': new (require('./dependencies.js'))(module, error(module, 'txt'))
    };

};
