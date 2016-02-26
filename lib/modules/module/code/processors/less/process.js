var async = require('async');

require('colors');
module.exports = async(function *(resolve, reject, styles) {
    "use strict";

    let less = require('less');
    less.render(styles, {'compress': true}, function (e, output) {

        if (e) {
            reject('error compiling less: "' + '": ' + e);
            return;
        }

        resolve(output.css);

    });

});
