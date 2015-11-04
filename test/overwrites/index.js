var assert = require('assert');

describe('Application Overwrites', function () {
    "use strict";

    let config, application, overwrite;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let Config = require('path').join(require('main.lib'), 'config');
                Config = require(Config);

                let path = require('path').join(__dirname, './source/config.json');
                config = new Config(path);
                yield config.initialise();

                application = config.modules.applications.items.testapp;
                overwrite = application.overwrites.items['library1/.'];
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
