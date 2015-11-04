window.Coordinate = function () {
    "use strict";

    var tasks = {};
    var callback;
    var fired = 0;

    for (var i in arguments) {
        if (typeof arguments[i] === 'string') tasks[arguments[i]] = false;
        if (typeof arguments[i] === 'function') callback = arguments[i];
    }

    for (var task in tasks) {

        (function (task, coordinator) {

            coordinator[task] = Delegate(coordinator, function () {
                coordinator.done(task);
            });

        })(task, this);

    }

    if (!callback) {
        console.error('invalid tasks coordination callback');
        return;
    }

    // @anyway fire the callback even if it was previously fired
    var check = function (anyway) {

        for (var i in tasks) if (tasks[i] === false) return false;

        if (fired && !anyway) {
            return;
        }

        fired++;
        callback();

        return true;
    };

    this.done = function (task, anyway) {

        if (typeof tasks[task] !== 'boolean') {
            console.warn('invalid task');
            return;
        }

        tasks[task] = true;
        check(anyway);

    };

    this.fire = function () {
        check(true);
    };

};
