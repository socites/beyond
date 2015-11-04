var assert = require('assert');

describe('Application Start Script', function () {
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

    it('should have "testapp" application', function () {

        assert.equal(beyond.applications.length, 1);

        application = beyond.applications.items.testapp;
        assert.equal(typeof application, 'object');

    });

    it('should exist', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let start = yield application.client.script('start.js', 'en');
                assert.equal(typeof start, 'object');
                assert.equal(start.type, 'content');
                assert.equal(start.contentType, 'application/javascript');

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });


    });

});
