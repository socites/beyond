module.exports = function () {
    "use strict";

    this.hello = require('async')(function *(resolve, reject) {
        resolve('hello world');
    });

};
