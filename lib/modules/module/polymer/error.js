module.exports = function (module, reference) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'module: "' + module.ID + '"\n';
        error += 'polymer code\n';
        error += reference + '\n';

        error = new Error(error);

        return error;

    };

};
