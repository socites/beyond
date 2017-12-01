module.exports = function (module, type) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'at ' + module.path + '/module.json' + '\n';
        error += 'type: "' + type + '"\n';

        error = new Error(error);

        return error;

    };

};
