var assert = require('assert');

describe('Cache', function () {
    "use strict";

    it('must save data', function (done) {

        let key = 'henry';
        let value = {'name': 'henry', 'lastname': 'box'};

        let co = require('co');
        co(function *() {

            try {

                let root = require('path').join(__dirname, './cache');
                let cache = new (require('../helpers/cache'))(root);
                yield cache.push('users', './users');

                cache = cache.paths['users'];

                let item, result;

                yield cache.remove(key);
                result = yield cache.get(key);
                assert.equal('undefined', typeof result);

                yield cache.push(key, value);
                result = yield cache.get(key);
                assert.equal('henry', result.value.name);
                assert.equal('memory', result.source);

                cache.flush();
                result = yield cache.get(key);
                assert.equal('henry', result.value.name);
                assert.equal('disk', result.source);

                result = yield cache.value(key);
                assert.equal('henry', result.name);

                done();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    });

});
