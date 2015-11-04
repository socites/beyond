var assert = require('assert');

describe('Configuration hosts', function () {
    "use strict";

    let config;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let path = require('path').join(__dirname, 'source/config.json');

                let Config = require('path').join(require('main.lib'), 'config');
                Config = require(Config);

                config = new (Config)(path, {'local': false});
                yield config.initialise();
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('check library hosts', function () {

        let application = config.modules.applications.items.example;
        assert.equal(application.build.hosts.js, 'http://example.com');
        assert.equal(application.build.hosts.ws, 'http://example.com');

        let library = config.modules.libraries.items.common;
        let version = library.versions.items['0.1'];

        assert.equal(version.build.hosts.js, 'http://common.com/js/0.1');
        assert.equal(version.build.hosts.ws, 'http://common.com/ws');

    });

    it('check application hosts', function () {

        try {

            let co = require('co');
            co(function *() {

                try {

                    let modules, applications, application, hosts;

                    let Modules = require('path').join(require('main.lib'), 'modules');
                    Modules = require(Modules);
                    modules = new Modules(config, {'local': false});
                    yield modules.initialise();

                    applications = modules.applications;
                    application = applications.items.example;
                    hosts = application.hosts('en');
                    assert.equal(hosts.application.js, 'http://example.com');
                    assert.equal(hosts.application.ws, 'http://example.com');
                    assert.equal(hosts.libraries.common.js, 'http://common.com/js/0.1');
                    assert.equal(hosts.libraries.common.ws, 'http://common.com/ws');

                    modules = new Modules(config);
                    yield modules.initialise();

                    applications = modules.applications;
                    application = applications.items.example;
                    hosts = application.hosts('en');
                    assert.equal(hosts.application.js, '/example/en');
                    assert.equal(hosts.libraries.common.js, '/libraries/common/0.1');
                    assert.equal(hosts.libraries.common.ws, '/libraries/common');

                }
                catch (exc) {
                    console.log(exc.stack);
                }
            });

        }
        catch (exc) {
            console.log(exc.stack);
        }

    });

});
