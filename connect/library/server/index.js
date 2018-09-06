let async = require('async');

module.exports = function () {

    this.hello = async(function* (resolve, reject, params, context) {
        resolve('hello world');
    });

};
