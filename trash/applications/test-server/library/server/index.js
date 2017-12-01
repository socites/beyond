module.exports = function () {
    "use strict";

    let beyond = require('../../../..');
    let Rest = beyond.helpers.Rest;
    let rest = new Rest(
        'logs',
        {
            'logs': {'calls': 'calls.log', 'errors': 'errors.log'},
            'hosts': {'example': {'development': 'http://localhost:9000'}}
        },
        'development');

    this.delayed = require('async')(function *(resolve, reject, params, context) {

        setTimeout(function () {
            resolve('hello world');
        }, 2000);

    });

    this.rest = require('async')(function *(resolve, reject, params, context) {
        let rq = new rest.Request();
        rq.host = 'example';
        rq.path = '/';
        resolve((yield rq.execute()));
    });

};
