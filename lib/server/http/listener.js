module.exports = function (modules, specs) {
    "use strict";

    return function (request, response) {

        var co = require('co');
        co(function * () {

            try {

                let resource = yield require('./resource')(request.url, modules, specs);

                if (resource) require('./writer')(response, resource);
                else require('./writer/404.js')(response);

            }
            catch (exc) {

                console.log(exc.stack);
                require('./writer/500.js')(response, exc);

            }

        });

    };

};
