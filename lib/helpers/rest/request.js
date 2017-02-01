module.exports = function (config, environment, logs) {
    "use strict";

    let async = require('async');
    let co = require('co');

    return function () {

        let http = require('http');

        let method = 'GET';
        Object.defineProperty(this, 'method', {
            'get': function () {
                return method;
            },
            'set': function (value) {
                if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(value) === -1) {
                    throw new Error('Method "' + value + '" is invalid');
                }
                method = value;
            }
        });

        let accessToken;
        Object.defineProperty(this, 'accessToken', {
            'get': function () {
                return accessToken;
            },
            'set': function (value) {
                accessToken = value;
            }
        });

        // host address
        let host;
        Object.defineProperty(this, 'host', {
            'get': function () {
                return host;
            },
            'set': function (value) {

                if (!config.hosts) throw new Error('No hosts specified in configuration');

                if (value.substr(0) !== '/') value = '/' + value;
                host = config.hosts[value];
                if (!host) throw new Error('Host "' + value + '" not found');

            }

        });

        let path;
        Object.defineProperty(this, 'path', {
            'get': function () {

                if (path.substr(0, 1) !== '/') path = '/' + path;
                return path;

            },
            'set': function (value) {
                path = value;
            }
        });

        let Params = require('./params.js');
        let params = new Params();
        Object.defineProperty(this, 'params', {
            'get': function () {
                return params;
            }
        });

        Object.defineProperty(this, 'url', {
            'get': function () {

                let url = this.host;
                if (this.path) url += this.path;

                if (this.method === 'GET') {
                    url += params.querystring;
                }

                return url;

            }
        });

        this.execute = async(function *(resolve, reject) {

            try {

                let url = this.url;
                let options = require('url').parse(url);
                options.method = this.method;

                let body;

                if (['POST', 'PUT'].indexOf(this.method) !== -1) {

                    body = params.stringified.replace(/\//g, '\\/');

                    options.headers = {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Content-Length': body.length
                    };
                    if (this.accessToken) {
                        options.headers.accessToken = this.accessToken;
                    }

                }
                else {
                    options.method = this.method;
                }

                let data = '';

                // control if request takes more than 10 secs
                let time = Date.now();
                let timer = setTimeout(function () {

                    let parsed = require('url').parse(url);

                    let message = '';
                    message += 'action "';
                    message += require('path').join(parsed.hostname, parsed.pathname);
                    message += '" is taking too much time';

                    console.warn(message);

                }, 5000);
                var request = http.request(options, function (handler) {

                    handler.on('data', function (content) {
                        data += content.toString();
                    });

                    handler.on('end', function (status) {

                        clearTimeout(timer);
                        co(function *() {

                            if (handler.statusCode !== 200) {

                                // log the response
                                let parameters = (options.method === 'GET') ? params.querystring : body;
                                let id = yield logs.save({
                                    'url': url,
                                    'parameters': parameters,
                                    'response': {
                                        'code': handler.statusCode,
                                        'message': data
                                    }
                                }, 'response', 'errors');

                                reject(new Error('Invalid response [1], check the log: ' + id));
                                return;

                            }

                            if (data === '') {

                                // log the response
                                let id = yield logs.save({
                                    'url': url,
                                    'parameters': params.querystring
                                }, 'empty_response', 'errors');

                                reject(new Error('Invalid response [2], check the log: ' + id));
                                return;

                            }

                            let response;
                            try {
                                response = JSON.parse(data);
                            }
                            catch (exc) {

                                // log the response
                                let id = yield logs.save({
                                    'url': url,
                                    'parameters': params.querystring,
                                    'response': data,
                                    'error': exc.message
                                }, 'invalid_response', 'errors');

                                reject(new Error('Invalid response received, check the log: ' + id));
                                return;

                            }

                            if (response.status !== 'ok' || typeof response.data === 'undefined') {

                                // log the response
                                let id = yield logs.save({
                                    'url': url,
                                    'parameters': params.querystring,
                                    'response': {
                                        'code': response.code,
                                        'message': response.message
                                    }
                                }, 'error', 'errors');

                                reject(new Error('Invalid response received, check the log: ' + id));
                                return;

                            }

                            // log the response
                            yield logs.save({
                                'url': url,
                                'parameters': params.querystring,
                                'response': data
                            }, 'response', 'calls');

                            resolve(response.data);

                        })

                    });

                });

                request.on('error', function (error) {

                    co(function *() {

                        // log the response
                        yield logs.save({
                            'url': url,
                            'parameters': params.querystring,
                            'error': error.message
                        }, 'connection_error', 'errors');

                        reject(new Error('Error executing request: ' + error.message));

                    });

                });

                if (['POST', 'PUT'].indexOf(this.method) !== -1) {
                    request.write(body);
                }
                request.end();

            }
            catch (exc) {

                yield logs.save({
                    'url': this.url,
                    'parameters': params.querystring,
                    'error': exc.message
                }, 'exception', 'errors');

                reject(exc);

            }

        }, this);

    };

};
