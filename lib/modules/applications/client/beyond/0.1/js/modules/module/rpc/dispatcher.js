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
        if (typeof options.cache === 'boolean') {
            options.cache = {
                'read': options.cache,
                'write': options.cache
            };
        }

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
                    callback(item.value, undefined, 'cache');

                    return;

                }

            }

        }

        channel.emit('rpc', request.serialized, function (response) {

            if (typeof response === 'object' &&
                response !== null &&
                response.id === '__beyond__error__') {

                console.log('execution error on action "' + request.action + '"', response.error);
                callback(undefined, response.error);
                return;

            }

            if (options.cache && options.cache.write) {
                cache.save(request, response);
            }

            if (typeof callback === 'function') {
                callback(response, undefined, 'rpc');
            }

        });

    };

    this.execute = function () {

        var args = [].slice.call(arguments);

        var action, params, callback, options, request;
        if (args.length === 4) {
            action = args[0];
            params = args[1];
            callback = args[2];
            options = args[3];

            request = new Request(module, action, params);
        }
        else if (args.length === 3) {
            request = args[0];
            callback = args[1];
            options = args[2];
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
