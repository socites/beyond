var Holder = function (request, events, callback) {
    "use strict";

    var waiting = [];
    var fired;
    var done;

    this.push = function (reason) {

        if (waiting.indexOf(reason) !== -1) return;
        waiting.push(reason);

    };

    this.done = function () {

        done = true;
        if (!waiting.length) {
            fired = true;
            callback();
        }

    };

    this.release = function (reason) {

        if (fired) {
            console.error('RPC holder already fired');
            return;
        }

        var index = waiting.indexOf(reason);
        if (index === -1) {
            console.error('RPC reason is not in the list', reason);
            return;
        }

        waiting.splice(index, 1);
        if (!waiting.length && done) {
            fired = true;
            callback();
        }

    };

    events.trigger({'event': 'execute:before', 'async': true}, request, this, Delegate(this, function () {

        // execute the callback if there are no reasons to hold the execution,
        // or wait for the reasons be concluded
        setTimeout(Delegate(this, function () {
            this.done();
        }), 0);

    }));

};
