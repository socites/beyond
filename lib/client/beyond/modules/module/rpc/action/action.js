function Action(module, events) {
    "use strict";

    var Base = ActionBase(module, events);
    var POLICY = Object.freeze({
        'ALL_ERRORS': 1,
        'COMMUNICATION_ERRORS': 2,
        'NONE': 3,
        'DEFAULT': 3
    });
    var policy;

    return function (actionPath, params) {

        var action;
        var promise, resolve, reject;
        var callback;

        Object.defineProperty(this, 'POLICY', {
            'get': function () {
                return POLICY;
            }
        });
        Object.defineProperty(this, 'ERROR_CODE', {
            'get': function () {
                return beyond.ACTION_ERROR_CODE;
            }
        });
        Object.defineProperty(this, 'TIMEOUT_REASON', {
            'get': function () {
                return beyond.ACTION_TIMEOUT_REASON;
            }
        });

        function release() {
            promise = undefined;
            resolve = undefined;
            reject = undefined;
            action = undefined;
            executed = true;
            executing = false;
        }

        var execute = Delegate(this, function () {

            action = new Base(actionPath, params);
            action.onResponse = Delegate(this, function (response) {

                var _resolve = resolve;
                release();
                if (_resolve) {
                    _resolve(response);
                }
                if (typeof this.onResponse === 'function') {
                    this.onResponse(response);
                }
                if (callback) {
                    callback(response);
                }

            });
            action.onError = Delegate(this, function (error) {

                var ERROR = action.ERROR_CODE;

                if (error.code === ERROR.CANCELED) {
                    release();
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }
                    if (callback) {
                        callback(undefined, error);
                    }
                    return;
                }

                var communicationErrors = [
                    ERROR.SOCKET_ERROR,
                    ERROR.SOCKET_DISCONNECT,
                    ERROR.CONNECTION_FAILED,
                    ERROR.TIMEOUT,
                    ERROR.PRE_EXECUTION
                ];
                if (policy === POLICY.ALL_ERRORS ||
                    (policy === POLICY.COMMUNICATION_ERRORS &&
                    communicationErrors.indexOf(error.code) !== -1)) {

                    beyond.showConnectionError(execute);

                }
                else {
                    var _reject = reject;
                    release();
                    if (_reject) {
                        _reject(error);
                    }
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }
                    if (callback) {
                        callback(undefined, error);
                    }
                }

            });

            if (this.holdersTimeout) action.holdersTimeout = this.holdersTimeout;
            if (this.ackTimeout) action.ackTimeout = this.ackTimeout;
            if (this.responseTimeout) action.responseTimeout = this.responseTimeout;
            if (this.cache) action.cache = this.cache;

            action.execute();

        });

        var executed, executing;
        Object.defineProperty(this, 'executing', {
            'get': function () {
                return !!executing;
            }
        });
        Object.defineProperty(this, 'executed', {
            'get': function () {
                return !!executed;
            }
        });
        this.execute = function (specs) {

            if (!specs) {
                specs = {};
            }
            if (typeof specs !== 'object') {
                throw new Error('Invalid parameters');
            }

            policy = (!specs.policy) ? POLICY.DEFAULT : specs.policy;

            if (executed || executing) {
                console.error('Action can only be executed once');
                return;
            }
            executing = true;

            if (typeof specs.callback === 'function') {
                callback = specs.callback;
            }

            if (specs.promise) {

                promise = new Promise(function (_resolve, _reject) {
                    resolve = _resolve;
                    reject = _reject;
                });

                execute();

                return {
                    'promise': promise,
                    'cancel': Delegate(this, 'cancel')
                };

            }
            else {
                execute();
            }

        };
        this.cancel = function () {

            if (!executing) {
                console.error('Action is not being executed', actionPath, params);
                return;
            }
            action.cancel();

        };

    };

}
