window.Coordinate = function () {
    "use strict";

    var tasks = {};
    Object.defineProperty(this, 'tasks', {
        'get': function () {
            return tasks;
        }
    });

    var callback;
    var fired = 0;

    var args = [].slice.call(arguments);

    for (var i in args) {

        if (args[i] instanceof Array) {
            for (var j in args[i]) {
                tasks[args[i][j]] = false;
            }
        }

        if (typeof args[i] === 'string') tasks[args[i]] = false;
        if (typeof args[i] === 'function') callback = args[i];

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
