module.exports = function (generator, context) {
    "use strict";

    let args;

    let wrapper = function (resolve, reject) {

        let co = require('co');

        let wrap = co.wrap(generator);
        args.unshift(resolve, reject);

        let promise = wrap.apply(context, args);
        promise.catch(function (exc) {
            reject(exc);
        });

    };

    return function () {
        args = Array.prototype.slice.call(arguments);
        return new Promise(wrapper);
    };

};
