var assert = require('assert');

describe('Modules', function () {
    "use strict";

    let module;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let Module = require('path').join(require('main.lib'), 'modules/module');
                Module = require(Module);

                let path = require('path').join(__dirname, './source/module.json');
                module = new Module(path);
                yield module.initialise();

                assert.equal('function', typeof module.code);
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('should have its code', function (done) {

        let co = require('co');
        co(function *() {

            try {

                assert.equal('function', typeof module.code);

                let resource = yield module.code();
                assert.equal(resource.type, 'content');
                assert.notEqual(resource.content.indexOf('this is the test file'), -1);
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

    it('should have static resources', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let resource;

                resource = yield module.static.resource('static/hello.txt');
                assert.equal(resource.type, 'file');
                assert.equal(resource.contentType, 'text/plain');

                resource = yield module.static.resource('undefined.txt');
                assert.equal(typeof resource, 'undefined');

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
