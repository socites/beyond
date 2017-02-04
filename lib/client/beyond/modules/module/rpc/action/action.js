function Action(module, events) {
    "use strict";

    var ActionBase = ActionBase(module, events);
    var POLICY = Object.freeze({
        'ALL_ERRORS': 1,
        'COMMUNICATION_ERRORS': 2,
        'NONE': 3,
        'DEFAULT': 3
    });
    var policy;

    return function (actionPath, params) {

        var action;

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

        var execute = Delegate(this, function () {

            action = new ActionBase(actionPath, params);
            action.onResponse = function (response) {

                executing = false;
                executed = true;

                if (typeof this.onResponse === 'function') {
                    this.onResponse(response);
                }

            };
            action.onError = function (error) {

                var ERROR = action.ERROR_CODE;

                if (error.code === ERROR.CANCELED) {
                    if (typeof this.onError === 'function') {
                        this.onError(error);
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
                    (policy === POLICY.COMMUNICATION_ERRORS && communicationErrors.indexOf(error.code) !== -1)) {

                    beyond.registerError('action-' + action.id, execute);

                }
                else if (typeof this.onError === 'function') {
                    this.onError(error);
                }

            };

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
        this.execute = function (_policy) {

            policy = (!POLICY[_policy]) ? POLICY.DEFAULT : POLICY[_policy];

            if (executed || executing) {
                console.error('Action can only be executed once');
                return;
            }
            executing = true;

            execute();

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
