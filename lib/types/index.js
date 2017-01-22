module.exports = new (function () {
    "use strict";

    let registered = ['code', 'page', 'polymer'];
    Object.defineProperty(this, 'registered', {
        'get': function () {
            return registered;
        }
    });

    this.Code = require('./type.js')(require('./registered/code'));
    this.Page = require('./type.js')(require('./registered/page'));
    this.Polymer = require('./type.js')(require('./registered/polymer'));

});
