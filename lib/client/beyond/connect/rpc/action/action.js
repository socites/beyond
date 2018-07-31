function Action(module, events) {
    "use strict";

    var Base = ActionBase(module, events);
    var POLICY = Object.freeze({
        'COMMUNICATION_ERRORS': 1,
        'NONE': 2,
        'DEFAULT': 2
    });
    var policy;

    var avoidDuplicated;

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

                var rejectAction = Delegate(this, function () {

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

                });

                var communicationErrors = [
                    ERROR.SOCKET_ERROR,
                    ERROR.SOCKET_DISCONNECT,
                    ERROR.CONNECTION_FAILED,
                    ERROR.TIMEOUT,
                    ERROR.PRE_EXECUTION
                ];
                if (avoidDuplicated &&
                    error.code === ERROR.TIMEOUT &&
                    (policy === POLICY.COMMUNICATION_ERRORS)) {

                    rejectAction();

                }
                else if (policy === POLICY.COMMUNICATION_ERRORS &&
                    communicationErrors.indexOf(error.code) !== -1) {

                    beyond.showConnectionError(execute);

                }
                else {

                    rejectAction();

                }

            });

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

            action = new Base(actionPath, params);

            if (typeof specs.holdersTimeout === 'number' && specs.holdersTimeout >= 0) {
                action.holdersTimeout = specs.holdersTimeout;
            }
            if (typeof specs.ackTimeout === 'number' && specs.ackTimeout >= 0) {
                action.ackTimeout = specs.ackTimeout;
            }
            if (typeof specs.responseTimeout === 'number' && specs.responseTimeout >= 0) {
                action.responseTimeout = specs.responseTimeout;
            }
            if (!!specs.avoidDuplicated) {
                avoidDuplicated = true;
            }
            if (specs.cache) {
                action.cache = this.cache;
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
