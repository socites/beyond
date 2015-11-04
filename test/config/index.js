var assert = require('assert');

describe('Config', function () {
    "use strict";

    let config;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let path = require('path').join(__dirname, 'source/config.json');
                config = new (require('../../lib/config'))(path);
                yield config.initialise();

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });


    describe('verify ports', function () {

        it('must return the configured values', function () {

            assert.equal(3010, config.ports.http);
            assert.equal(3011, config.ports.rpc);

        });

    });

    describe('verify libraries', function () {

        it('must return one library', function () {
            assert.equal(1, config.modules.libraries.length);
        });

    });

    describe('verify applications', function () {

        it('must have configured application "example"', function () {
            assert.equal(1, config.modules.applications.length);
        });

    });

});
