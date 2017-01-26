module.exports = new (function () {
    "use strict";

    let registered = {
        'code': 'Code',
        'page': 'Page',
        'control': 'Control',
        'icons': 'Icons'
    };
    Object.defineProperty(this, 'registered', {
        'get': function () {
            return registered;
        }
    });

    this.exists = function (find) {

        for (let type in registered) {
            if (type === find) {
                return true;
            }
        }

        return false;

    };

    this.Code = require('./type.js')(require('./registered/code'));
    this.Page = require('./type.js')(require('./registered/page'));
    this.Control = require('./type.js')(require('./registered/control'));
    this.Icons = require('./type.js')(require('./registered/icons'));

});
