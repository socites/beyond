var Dispatcher = function (module, events) {
    "use strict";

    var cache = new Cache();
    Object.defineProperty(this, 'cache', {
        'get': function () {
            return cache;
        }
    });

    Object.defineProperty(this, 'Request', {
        'get': function () {
            return Request;
        }
    });

    var execute = function (channel, request, callback, options) {

        if (!options) options = {};
        if (options.cache && options.cache.read) {

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

                if (item && typeof callback === 'function') {

                    // the second parameter true means that the response
                    // was taken from cache
                    callback({
                        'data': item.value
                    }, true);

                    return;

                }

            }

        }

        channel.emit('rpc', request.serialized, function (response) {

            if (typeof response === 'object' && response !== null && response.id === '__beyond__error__') {

                console.log('execution error on action "' + request.action + '"', response);
                callback(undefined, {'message': response.message});
                return;

            }

            if (options.cache && options.cache.write) {
                cache.save(request, response.data);
            }

            if (typeof callback === 'function') {
                callback(response);
            }

        });

    };

    this.execute = function () {

        var action, params, callback, options, request;
        if (arguments.length === 4) {
            action = arguments[0];
            params = arguments[1];
            callback = arguments[2];
            options = arguments[3];

            request = new Request(module, action, params);
        }
        else if (arguments.length === 3) {
            request = arguments[0];
            callback = arguments[1];
            options = arguments[2];
        }
        else {
            console.error('invalid method invocation');
            return;
        }

        // holder allows hooks to hold the actions to be executed
        // if for some reason, the interceptor interprets that the channel is not ready
        // the interceptor can use the hooker as follows
        //      holder.push('reason');
        //      holder.done('reason');
        // when there are no reasons to hold the execution, then the callback is call
        // and the action is consequently executed
        var holder = new Holder(function () {

            module.channel(function (channel) {
                execute(channel, request, callback, options);
            });

        });

        events.trigger({'event': 'execute:before', 'async': true}, request, holder, function () {

            // execute the callback if there are no reasons to hold the execution,
            // or wait for the reasons be concluded
            holder.done();

        });

    };

};
