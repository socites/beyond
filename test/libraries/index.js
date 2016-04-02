var assert = require('assert');

describe('Libraries collection', function () {
    "use strict";

    let libraries;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let path = require('path').join(__dirname, 'source/config.json');

                let Modules = require('path').join(require('main.lib'), 'modules');
                Modules = require(Modules);
                let modules = new Modules(path);
                yield modules.initialise();

                libraries = modules.libraries;
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('should have two libraries', function () {

        // one of the libraries is beyond.js
        assert.equal(3, libraries.length);

    });

    it('item "beyond.js" should exist', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let library = libraries.items['beyond'];
                assert.equal(library.valid, true);

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('library "common" should have one version with two modules', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let library = libraries.items.common;
                assert.equal(1, library.versions.length);

                let version = library.versions.items['0.0.1'];
                assert.equal(true, version.valid);

                let modules = version.modules;

                yield modules.process();

                assert.equal(2, modules.length);

                let module;

                module = modules.items['hello'];
                assert.equal(module.ID, 'libraries/common/hello');

                module = modules.items['layout'];
                assert.equal(module.ID, 'libraries/common/layout');

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
