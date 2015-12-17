/*globals Delegate*/
(function() {
    window.Coordinate = function () {
    "use strict";
        var cnt = this;
        
        cnt.tasks = {};
        cnt.callback;
        cnt.fired = 0;
    
        for (var i in arguments) {
            if (typeof arguments[i] === 'string') cnt.tasks[arguments[i]] = false;
            if (typeof arguments[i] === 'function') cnt.callback = arguments[i];
        }
    
        for (var task in cnt.tasks) {
    
            (function (task, coordinator) {
    
                coordinator[task] = Delegate(coordinator, function () {
                    coordinator.done(task);
                });
    
            })(task, cnt);
    
        }
    
        if (!cnt.callback) {
            console.error('invalid tasks coordination callback');
            return;
        }
    
        // @anyway fire the callback even if it was previously fired
        cnt.check = function (anyway) {
    
            for (var i in cnt.tasks) if (cnt.tasks[i] === false) return false;
    
            if (cnt.fired && !anyway) {
                return;
            }
    
            cnt.fired++;
            cnt.callback();
    
            return true;
        };
    
        cnt.done = function (task, anyway) {
    
            if (typeof cnt.tasks[task] !== 'boolean') {
                console.warn('invalid task');
                return;
            }
    
            cnt.tasks[task] = true;
            cnt.check(anyway);
    
        };
    
        cnt.fire = function () {
            cnt.check(true);
        };
    
    };
})();
