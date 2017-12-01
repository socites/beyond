/**
 * Native BeyondJS types
 */
module.exports = function () {
    "use strict";

    let types = new Map();
    Object.defineProperty(this, 'types', {
        'get': function () {
            return types;
        }
    });

    let processors = new Map();
    Object.defineProperty(this, 'processors', {
        'get': function () {
            return processors;
        }
    });

    types.set('code', require('./registered/code'));
    types.set('page', require('./registered/page'));
    types.set('control', require('./registered/control'));
    types.set('icons', require('./registered/icons'));

    processors.set('css', require('./processors/css.js'));
    processors.set('html', require('./processors/html.js'));
    processors.set('js', require('./processors/js.js'));
    processors.set('jsx', require('./processors/jsx.js'));
    processors.set('less', require('./processors/less.js'));
    processors.set('mustache', require('./processors/mustache.js'));
    processors.set('txt', require('./processors/txt.js'));

};
