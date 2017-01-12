var assert = require('assert');

describe('Graphs JS', function () {
    'use strict';

    let Rest = require('../helpers/rest');

    it('must get keys', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let rest = new Rest(__dirname, './source/config.json', 'development');
                let rq = new rest.Request();
                rq.host = 'graphs.js';

                rq.path = 'libraries/keys/get';
                let errors = rq.params.map({
                    'app_id': '2',
                    'ds_id': '000000000000000000000010',
                    'app_secret_key': 'somekey'
                });

                assert('undefined', typeof errors);

                let response = yield rq.execute();
                assert('string', typeof response);
                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
