module.exports = function (exports, config, environment) {
    "use strict";

    if (!environment) environment = 'production';

    let hosts = {};
    Object.defineProperty(exports, 'hosts', {
        'get': function () {
            return hosts;
        }
    });

    // recursively set the applications hosts
    var iterate = function (config, ID) {

        if (!ID) ID = '/';

        if (typeof config[environment] === 'string') hosts[ID] = config[environment];

        for (let element in config) {

            let elementID = (ID === '/') ? '/' + element : ID + '/' + element;
            if (typeof config[element] === 'object') iterate(config[element], elementID);

        }

    };

    iterate(config);

};
