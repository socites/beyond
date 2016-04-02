var assert = require('assert');

describe('Application Imports', function () {
    "use strict";

    let beyond, application;
    before(function (done) {

        let path = require('path').join(__dirname, './source/config.json');
        let Beyond = require(process.cwd());
        beyond = new Beyond(path);

        let co = require('co');
        co(function *() {

            try {

                yield beyond.initialise();
                assert.equal(2, beyond.applications.length);
                assert.notEqual(-1, beyond.applications.keys.indexOf('test_imports'))

                application = beyond.applications.items.test_imports;
                assert.equal(typeof application, 'object');

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('should get its modules', function (done) {

        let co = require('co');
        co(function *() {

            try {

                assert.equal(application.libraries.length, 4);

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
                            assert.equal(1, modules.length);
                            break;
                        case 'lib2':
                            assert.equal(2, modules.length);
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
