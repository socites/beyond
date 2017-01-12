var assert = require('assert');

describe('Socites', function () {
    "use strict";

    let Rest = require('../helpers/rest');

    it('must identify a community', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let rest = new Rest(__dirname, 'source/config.json', 'development');
                let rq = new rest.Request();
                rq.host = 'socites/communiverses';

                rq.path = 'identify';
                let errors = rq.params.map({
                    'ds_name': 'ccmc'
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
