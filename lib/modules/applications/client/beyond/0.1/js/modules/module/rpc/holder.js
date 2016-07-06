var Holder = function (request, events, callback) {
    "use strict";

    var waiting = [];
    var fired;
    var done;

    this.push = function (reason) {
        if (waiting.indexOf(reason) !== -1) return;
        waiting.push(reason);
    };

    var timer = setTimeout(function () {
        console.log('Holder of action "' + request.action + '" is being delayed, still waiting:', waiting);
    }, 5000);

    this.done = function () {

        done = true;
        if (!waiting.length) {
            clearTimeout(timer);
            fired = true;
            callback();
        }

    };

    this.release = function (reason) {

        if (fired) {
            console.error('Holder already fired');
            return;
        }

        var index = waiting.indexOf(reason);
        if (index === -1) {
            console.error('Holder reason "' + reason + '" not set');
            return;
        }

        waiting.splice(index, 1);
        if (!waiting.length && done) {
            clearTimeout(timer);
            fired = true;
            callback();
        }

    };

    events.trigger('execute:before', request, this);

    setTimeout(Delegate(this, 'done'), 0);

};
