var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config) {

        if (!(config instanceof Array)) {
            reject(error('invalid processor configuration'));
            return;
        }

        let includes = '';
        for (let i in config) {

            let entry = config[i];
            if (typeof entry !== 'string') {
                reject(error('invalid import configuration'));
                return;
            }

            let href = entry;
            includes = '<link rel="import" href="' + href + '">\n';

        }

        let header = '';
        header += '/****************\n';
        header += ' CONTROL INCLUDES\n';
        header += ' ****************/\n\n';

        let output = header + includes + '\n\n';
        resolve(output);
        return;

        resolve(output);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
