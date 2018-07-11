module.exports = new (function () {
    'use strict';

    this.async = require('./async.js');
    this.helpers = require('./helpers');

    this.Server = require('./server.js');
    this.Builder = require('./builder.js');

});
