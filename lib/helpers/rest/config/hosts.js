module.exports = function (exports, input, environment) {
    "use strict";

    if (!environment) environment = 'production';

    let hosts = {};
    Object.defineProperty(exports, 'hosts', {
        'get': function () {
            return hosts;
        }
    });

    // recursively set the applications hosts
    var iterate = function (input, ID) {

        if (!ID) ID = '/';

        if (typeof input[environment] === 'string') hosts[ID] = input[environment];

        for (let element in input) {

            let elementID = (ID === '/') ? '/' + element : ID + '/' + element;
            if (typeof input[element] === 'object') iterate(input[element], elementID);

        }

    };

    iterate(input);

};
