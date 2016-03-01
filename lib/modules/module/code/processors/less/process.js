var async = require('async');

require('colors');
module.exports = async(function *(resolve, reject, styles, error) {
    "use strict";

    let less = require('less');
    less.render(styles, {'compress': true}, function (e, output) {

        if (e) {
            reject(error('error compiling less: "' + e.message + '"'));
            return;
        }

        resolve(output.css);

    });

});
