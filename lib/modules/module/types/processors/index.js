module.exports = function (module) {
    "use strict";

    let error = require('./error.js');

    return {
        'polymer-css': new (require('./polymer/css.js'))(module, error(module, 'css')),
        'polymer-less': new (require('./polymer/less.js'))(module, error(module, 'less')),
        'polymer-html': new (require('./polymer/html.js'))(module, error(module, 'html')),
        'polymer-js': new (require('./polymer/js.js'))(module, error(module, 'js')),
        'polymer-txt': new (require('./polymer/txt'))(module, error(module, 'txt')),
        'polymer-jsx': new (require('./polymer/jsx.js'))(module, error(module, 'jsx')),
        'polymer-imports': new (require('./polymer/imports.js'))(module, error(module, 'imports')),
        'polymer-dependencies': new (require('./polymer/dependencies.js'))(module, error(module, 'dependencies')),
        'script-css': new (require('./scripts/css'))(module, error(module, 'css')),
        'script-less': new (require('./scripts/less'))(module, error(module, 'less')),
        'script-html': new (require('./scripts/html.js'))(module, error(module, 'html')),
        'script-js': new (require('./scripts/js.js'))(module, error(module, 'js')),
        'script-txt': new (require('./scripts/txt'))(module, error(module, 'txt')),
        'script-jsx': new (require('./scripts/jsx.js'))(module, error(module, 'jsx')),
        'script-dependencies': new (require('./scripts/dependencies.js'))(module, error(module, 'dependencies'))
    };

};
