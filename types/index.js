/**
 * Native BeyondJS types
 */
module.exports = function () {
    "use strict";

    let registered = new Map();
    Object.defineProperty(this, 'registered', {
        'get': function () {
            return registered;
        }
    });

    registered.set('code', require('./registered/code'));
    registered.set('page', require('./registered/page'));
    registered.set('control', require('./registered/control'));
    registered.set('icons', require('./registered/icons'));

};
