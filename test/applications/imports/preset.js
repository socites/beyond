var assert = require('assert');

describe('Application Imports using presets', function () {
    "use strict";

    let beyond, application;
    before(function (done) {

        let path = require('path').join(__dirname, './source/config.json');
        beyond = new (require(process.cwd()))(path);

        let co = require('co');
        co(function *() {

            yield beyond.initialise();
            done();

        });

    });

    it('should have "preset" application', function () {

        assert.equal(2, beyond.applications.length);
        assert.notEqual(-1, beyond.applications.keys.indexOf('test_preset'))

        application = beyond.applications.items.test_preset;
        assert.equal('object', typeof application);

    });

    it('should get', function (done) {

        let co = require('co');
        co(function *() {

            try {

                assert.equal(4, application.libraries.length);

                for (let key of application.libraries.keys) {

                    let library = application.libraries.items[key];
                    let modules = library.modules;

                    yield modules.process();

                    switch (library.name) {
                        case 'vendor':
                            assert.equal(1, modules.length);
                            break;
                        case 'beyond':
                            assert.equal(1, modules.length);
                            break;
                        case 'lib1':
                            assert.equal(2, modules.length);
                            break;
                        case 'lib2':
                            // bye module is excluded
                            assert.equal(-1, modules.keys.indexOf('bye'));
                            assert.equal(1, modules.length);
                            break;
                        default:
                            assert(false);
                    }

                }
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
