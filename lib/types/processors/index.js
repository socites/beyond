module.exports = function (module) {
    "use strict";

    return {
        'css': new (require('./css.js'))(module),
        'html': new (require('./html.js'))(module),
        'js': new (require('./js.js'))(module),
        'jsx': new (require('./jsx.js'))(module),
        'less': new (require('./less.js'))(module),
        'mustache': new (require('./mustache.js'))(module),
        'txt': new (require('./txt.js'))(module)
    };

};
