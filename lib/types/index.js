module.exports = new (function () {
    "use strict";

    let registered = {
        'code': 'Code',
        'page': 'Page',
        'control': 'Control'
    };
    Object.defineProperty(this, 'registered', {
        'get': function () {
            return registered;
        }
    });

    this.Code = require('./type.js')(require('./registered/code'));
    this.Page = require('./type.js')(require('./registered/page'));
    this.Control = require('./type.js')(require('./registered/control'));

});
