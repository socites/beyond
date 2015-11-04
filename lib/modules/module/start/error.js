module.exports = function (module) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'module: "' + module.ID + '"\n';
        error += 'start code\n';

        error = new Error(error);

        return error;

    };

};
