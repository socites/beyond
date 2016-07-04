function Action(module, events) {

    return function (actionPath, params) {

        if (!actionPath || typeof actionPath !== 'string') {
            console.error('Invalid action path:', actionPath);
            return;
        }

        var request = new Request(module, actionPath, params);

        var cache = new Cache();
        this.cache = false;

        var timers = {};
        var timedout;
        this.ackTimeout = 2000;
        this.responseTimeout = 10000;

        var channel;

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
        var id;

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

        }

        var execute = Delegate(this, function () {

            channel.emit('rpc', request.serialized, Delegate(this, function (acknowledgeID) {

                // Action was timed out before the acknowledge arrived
                if (timedout) return;
                clearTimeout(timers.ack);

                timers.response = setTimeout(function () {

                    timedout = true;
                    if (typeof this.onError === 'function') this.onError('response timedout');

                }, this.responseTimeout);

                if (typeof acknowledgeID !== 'string' || !acknowledgeID) {
                    console.error('Invalid acknowledge id.');
                    return;
                }

                id = acknowledgeID;

                if (timedout) return;
                if (typeof this.onAcknowledge === 'function') this.onAcknowledge();

            }));

        });

        this.execute = function (callback) {

            if (!request) {
                console.error('Request not correctly specified');
                return;
            }

            if (this.cache) {
                var cached = this.getFromCache();
                if (cached) {
                    callback(cached)
                    return;
                }
            }

            if (typeof this.ackTimeout === 'number') {

                timers.ack = setTimeout(Delegate(this, function () {

                    timedout = true;
                    if (typeof this.onError === 'function') this.onError('acknowledge timedout');

                }), this.ackTimeout);

            }

            // holder allows hooks to hold the actions to be executed
            // if for some reason, the interceptor interprets that the channel is not ready
            // the interceptor can use the hooker as follows
            //      holder.push('reason');
            //      holder.done('reason');
            // when there are no reasons to hold the execution, then the callback is call
            // and the action is consequently executed
            var holder = new Holder(request, events, execute);
            holder.push('channel');

            module.channel(function (value) {
                channel = value;
                holder.release('channel');
            });

        };

        var onResponse = Delegate(this, function (response) {

            // Check if response refers to this action
            if (response.id !== id) return;
            if (timedout) return;

            executed = true;
            clearTimeout(timers.response);

            if (response.error) {

                console.log('Execution error on action "' + request.action + '".', response.error);
                if (typeof this.onError === 'function') this.onError('execution', response.error);
                return;

            }

            if (this.cache) {
                cache.save(request, response.message);
            }

            if (typeof this.onResponse === 'function') this.onResponse(response.message);

            if (module.library) module.library.unbind('response', onResponse);
            else beyond.unbind('response', onResponse);

        });

        if (module.library) module.library.bind('response', onResponse);
        else beyond.bind('response', onResponse);

    }

}
