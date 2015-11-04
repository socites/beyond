module.exports = function (module, script) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'module: "' + module.ID + '"\n';
        error += 'script: "' + script + '"\n';

        error = new Error(error);

        return error;

    };

};
