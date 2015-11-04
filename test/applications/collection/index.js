var assert = require('assert');

describe('Applications Collection', function () {
    "use strict";

    let applications;
    before(function (done) {

        try {

            let path = require('path').join(__dirname, 'source/config.json');

            let co = require('co');
            co(function *() {

                try {

                    let Modules = require('path').join(require('main.lib'), 'modules');
                    Modules = require(Modules);
                    let modules = new Modules(path);

                    yield modules.initialise();

                    applications = modules.applications;
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

    let example;
    it('get it from applications', function () {

        assert.equal(applications.keys[0], 'example');
        example = applications.items.example;
        assert.equal(typeof example, 'object');

    });

    it('static file index.html exists', function (done) {

        let co = require('co');
        co(function *() {

            try {

                let resource = yield example.static.resource('static/index.html', 'en');
                assert.equal('content', resource.type);

            }
            catch (exc) {
                if (exc instanceof Error) console.log(exc.stack);
                else console.log(exc);
                assert(false);
            }
            done();

        });

    });

    it('has one static file', function (done) {

        let co = require('co');
        co(function *() {

            try {
                yield example.static.process('en');
                assert.equal(example.static.length, 1);
                assert.equal(example.static.items['static/index.html'].type, 'content');
            }
            catch (exc) {
                console.log(exc.stack);
            }
            done();

        });

    });

});
