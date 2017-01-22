module.exports = function (module, processor) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'at ' + module.path + '/module.json' + '\n';
        error += 'processor: "' + processor + '"\n';

        error = new Error(error);

        return error;

    };

};
