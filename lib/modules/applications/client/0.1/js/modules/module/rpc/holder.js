var Holder = function (callback) {
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
            return;
        }

    };

    this.release = function (reason) {

        if (!waiting.length && fired) return;

        if (!waiting.length) {
            fired = true;
            callback();
            return;
        }

        var index = waiting.indexOf(reason);
        if (index === -1) return;

        waiting.splice(index, 1);
        if (!waiting.length) callback();

    };

};
