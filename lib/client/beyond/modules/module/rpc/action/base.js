function ActionBase(module, events) {
    "use strict";

    var incrementalId = 1;

    var ERROR_CODE = Object.freeze({
        'NO_ERROR': 0,
        'SOCKET_ERROR': 1,
        'SOCKET_DISCONNECT': 2,
        'CONNECTION_FAILED': 3,
        'EXECUTION': 4,
        'TIMEOUT': 5,
        'PRE_EXECUTION': 6,
        'CANCELED': 7
    });

    var TIMEOUT_REASON = Object.freeze({
        'PRE_EXECUTION': 1,
        'ACKNOWLEDGE': 2,
        'WAITING_RESPONSE': 3
    });

    beyond.ACTION_ERROR_CODE = ERROR_CODE;
    beyond.ACTION_TIMEOUT_REASON = TIMEOUT_REASON;

    return function (path, params) {

        var id = incrementalId;
        Object.defineProperty(this, 'id', {
            'get': function () {
                return id;
            }
        });
        incrementalId++;

        Object.defineProperty(this, 'module', {
            'get': function () {
                return module;
            }
        });

        if (!path || typeof path !== 'string') {
            console.error('Invalid action path:', path);
            return;
        }

        path = (path.substr(0, 1) === '/') ? path.substr(1) : path;
        Object.defineProperty(this, 'path', {
            'get': function () {
                return path;
            }
        });

        var request = new Request(this, params);
        var holder;

        var cache = new Cache();
        this.cache = false;

        var timers = {};
        this.holdersTimeout = 40000;
        this.ackTimeout = 4000;
        this.responseTimeout = 6000;

        var socket;

        var error = ERROR_CODE.NO_ERROR;
        Object.defineProperty(this, 'error', {
            'get': function () {
                return error;
            }
        });

        this.ERROR_CODE = ERROR_CODE;
        this.TIMEOUT_REASON = TIMEOUT_REASON;

        var executing;
        Object.defineProperty(this, 'executing', {
            'get': function () {
                return !!executing;
            }
        });

        var executed;
        Object.defineProperty(this, 'executed', {
            'get': function () {
                return !!executed;
            }
        });

        // The acknowledge id received from the server
        var acknowledgeId;

        this.getFromCache = function () {

            if (!request) {
                console.error('Request not correctly specified');
                return;
            }

            var cached = cache.read(request);
            if (cached) {

                var item;
                try {
                    item = JSON.parse(cached);
                }
                catch (exc) {

                    console.error('error parsing cached item:', cached);

                    // remove item to avoid this error on future requests
                    cache.invalidate(request);

                    // consider as if cache has never existed, continue and make the RPC request
                    item = undefined;

                }

                return item.value;

            }

        };

        var execute = Delegate(this, function (holderError) {

            clearTimeout(timers.holders);

            if (holderError) {

                if (!executing) return;

                cancelExecution();

                error = {
                    'code': ERROR_CODE.PRE_EXECUTION,
                    'data': holderError
                };

                console.error('Holder error', holderError);
                if (typeof this.onError === 'function') {
                    this.onError(error);
                }
                return;

            }

            if (typeof this.ackTimeout === 'number') {

                timers.ack = setTimeout(Delegate(this, function () {

                    if (!executing) return;

                    cancelExecution();

                    error = {
                        'code': ERROR_CODE.TIMEOUT,
                        'reason': TIMEOUT_REASON.ACKNOWLEDGE
                    };

                    console.error('Acknowledge timeout error on action "' + request.action.path + '"');
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }

                }), this.ackTimeout);

            }

            socket.emit('rpc', request.serialized, Delegate(this, function (_acknowledgeID) {

                // Action was timed out before the acknowledge arrived
                clearTimeout(timers.ack);
                if (!executing) return;

                timers.response = setTimeout(Delegate(this, function () {

                    if (!executing) return;

                    cancelExecution();

                    error = {
                        'code': ERROR_CODE.TIMEOUT,
                        'reason': TIMEOUT_REASON.WAITING_RESPONSE
                    };

                    console.error('Timeout error on action "' + request.action.path + '"');
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }

                }), this.responseTimeout);

                if (typeof _acknowledgeID !== 'string' || !_acknowledgeID) {
                    console.error('Invalid acknowledge id.');
                    return;
                }

                acknowledgeId = _acknowledgeID;
                if (typeof this.onAcknowledge === 'function') {
                    this.onAcknowledge();
                }

            }));

        });

        function cancelExecution() {

            executing = false;

            clearTimeout(timers.holders);
            clearTimeout(timers.ack);
            clearTimeout(timers.response);

            if (holder) {
                holder.cancel();
            }

            if (socket) {
                socket.off('response', onResponse);
                socket.off('error', onSocketError);
                socket.off('disconnect', onSocketDisconnect);
                socket.off('connect_error', onConnectionFailed);
                socket.off('connect_timeout', onConnectionFailed);
            }

        }

        this.cancel = function () {

            if (!executing) {
                return;
            }

            cancelExecution();
            error = {'code': ERROR_CODE.CANCELED};
            this.onError(error);

        };

        var onSocketError = Delegate(this, function () {

            if (!executing) {
                return;
            }

            cancelExecution();
            error = {'code': ERROR_CODE.SOCKET_ERROR};
            if (typeof this.onError === 'function') {
                this.onError(error);
            }

        });
        var onSocketDisconnect = Delegate(this, function () {

            if (!executing) {
                return;
            }

            cancelExecution();
            error = {'code': ERROR_CODE.SOCKET_DISCONNECT};
            if (typeof this.onError === 'function') {
                this.onError(error);
            }

        });
        var onConnectionFailed = Delegate(this, function () {

            if (!executing) {
                return;
            }

            cancelExecution();
            error = {'code': ERROR_CODE.CONNECTION_FAILED};
            if (typeof this.onError === 'function') {
                this.onError(error);
            }

        });

        var onResponse = Delegate(this, function (response) {

            if (typeof response !== 'object' || response === null || !response.id) {
                console.error('RPC invalid response or invalid response received', response);
                return;
            }

            if (!response.id) {
                console.error('RPC response id not received', response);
                return;
            }

            // Check if response refers to this action
            if (response.id !== acknowledgeId) return;
            if (!executing) return;

            cancelExecution();
            executed = true;

            clearTimeout(timers.response);

            if (response.error) {

                error = {
                    'code': ERROR_CODE.EXECUTION,
                    'data': response.error
                };

                console.error('Execution error on action "' + request.action.path + '".', response.error);
                if (typeof this.onError === 'function') {
                    this.onError(error);
                }
                return;

            }

            if (this.cache) {
                cache.save(request, response.message);
            }

            if (typeof this.onResponse === 'function') {
                this.onResponse(response.message);
            }

        });

        this.execute = function () {

            if (executing || executed) {
                console.error('Action can only be executed once');
                return;
            }
            executing = true;

            if (!request) {
                console.error('Request not correctly specified');
                return;
            }

            if (this.cache) {
                var cached = this.getFromCache();
                if (cached) {
                    if (typeof this.onResponse === 'function') {
                        this.onResponse(cached)
                    }
                    return;
                }
            }

            if (typeof this.holdersTimeout === 'number') {

                timers.holders = setTimeout(Delegate(this, function () {

                    if (!executing) {
                        return;
                    }

                    cancelExecution();

                    error = {
                        'code': ERROR_CODE.TIMEOUT,
                        'reason': TIMEOUT_REASON.PRE_EXECUTION
                    };
                    holder.cancel();

                    // At least one RPC holder did not release the implementation of the action.
                    console.error('Holders timeout error on action "' + request.action.path + '"');
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }

                }), this.holdersTimeout);

            }

            // holder allows hooks to hold the actions to be executed
            // if for some reason, the interceptor interprets that the socket is not ready
            // the interceptor can use the hooker as follows
            //      holder.push('reason');
            //      holder.done('reason');
            // when there are no reasons to hold the execution, then the callback is call
            // and the action is consequently executed
            holder = new Holder(request, events, execute);
            holder.push('socket');

            module.socket(function (value) {

                socket = value;

                function onConnect() {
                    holder.release('socket');
                    socket.off('connect', onConnect);
                }

                if (socket.connected) {
                    holder.release('socket');
                }
                else {
                    socket.on('connect', onConnect);
                    socket.connect();
                }

                socket.on('response', onResponse);
                socket.on('error', onSocketError);
                socket.on('disconnect', onSocketDisconnect);
                socket.on('connect_error', onConnectionFailed);
                socket.on('connect_timeout', onConnectionFailed);

            });

        };

    }

}
