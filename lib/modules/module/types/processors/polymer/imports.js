var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config, language) {

        if (!(config instanceof Array)) {
            reject(error('invalid processor configuration'));
            return;
        }

        let hosts = module.application.hosts(language);
        let includes = '';
        for (let i in config) {

            let entry = config[i];
            if (typeof entry !== 'string') {
                reject(error('invalid import configuration'));
                return;
            }

            entry = entry.split('/');
            if (entry.length < 2) {
                reject(error('invalid import configuration'));
                return;
            }

            let library = entry.shift();
            if (library === 'polymer') {

                let host = hosts.libraries.vendor.js + 'static/bower_components/';
                let href = host + entry.join('/');
                includes = '<link rel="import" href="' + href + '">\n';

            }
            else {
                reject(error('invalid import configuration'));
                return;
            }

        }

        let header = '';
        header += '/****************\n';
        header += ' CONTROL INCLUDES\n';
        header += ' ****************/\n\n';

        let output = header + includes + '\n\n';
        resolve(output);
        return;

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
