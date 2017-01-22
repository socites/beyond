module.exports = function (module) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'at ' + module.path + '/module.json' + '\n';

        error = new Error(error);

        return error;

    };

};
