var onError = function (events) {
    "use strict";

    requirejs.onError = function (err) {

        if (err.requireType === 'timeout') {

            events.trigger('error');
            for (var i in err.requireModules) {
                requirejs.undef(err.requireModules[i]);
            }

            // try again loading modules
            require(err.requireModules, function () {
                events.trigger('retried');
            });

        }
        else {
            console.log(err.stack);
        }

    };

};
