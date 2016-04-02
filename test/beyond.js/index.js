var assert = require('assert');

describe('Beyond.js library', function () {
    "use strict";

    it('must exist', function (done) {

        try {

            let co = require('co');
            co(function *() {

                try {

                    let path = require('path').join(require('main.lib'), 'modules');
                    let Beyond = require(path);

                    let beyond = new Beyond();
                    yield beyond.initialise();

                    beyond = beyond.libraries.items['beyond'].versions.items['0.1'];
                    assert(typeof beyond, 'object');

                    let module = yield beyond.modules.module('.');
                    yield module.initialise();
                    let code = yield module.code();

                    assert(typeof code, 'string');

                    done();

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
