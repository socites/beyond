module.exports = function (module, processor) {
    "use strict";

    return function (message) {

        let error = message + '\n';
        error += 'module: "' + module.ID + '"\n';
        error += 'polymer code\n';
        error += 'processor: "' + processor + '"\n';

        error = new Error(error);

        return error;

    };

};
