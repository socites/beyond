module.exports = function (module) {
    "use strict";

    let error = require('./error.js');

    return {
        'css': new (require('./css.js'))(module, error(module, 'css')),
        'less': new (require('./less.js'))(module, error(module, 'less')),
        'html': new (require('./html.js'))(module, error(module, 'html')),
        'js': new (require('./js.js'))(module, error(module, 'js')),
        'jsx': new (require('./jsx.js'))(module, error(module, 'jsx')),
        'dependencies': new (require('./dependencies.js'))(module, error(module, 'dependencies'))
    };

};
