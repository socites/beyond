var exposeReady = function (beyond, events) {

    var ready;
    Object.defineProperty(beyond, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var callbacks = [];

    window.addEventListener('WebComponentsReady', function () {

        ready = true;
        events.trigger('ready');

        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    });

    beyond.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

};
