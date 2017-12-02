module.exports = function (module, type, processor) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'at ' + module.path + '/module.json' + '\n';
        error += 'type: "' + type + '"\n';
        error += (processor) ? 'processor: "' + processor + '"\n' : '';

        error = new Error(error);

        return error;

    };

};
