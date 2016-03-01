/**
 * Beyond is ready when the start code was completely executed
 * and when the events WebComponentsReady is triggered, required to process polymer components
 *
 * @param beyond
 * @param events
 */
var exposeReady = function (beyond, events) {

    var ready;
    Object.defineProperty(beyond, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var callbacks = [];

    var coordinate = new Coordinate('webComponentsReady', 'startCode', function () {

        ready = true;
        events.trigger('ready');

        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    });

    var onStart = function () {

        events.unbind('start', onStart);
        coordinate.done('startCode');

    };

    events.bind('start', onStart);

    window.addEventListener('WebComponentsReady', coordinate.WebComponentsReady);

    beyond.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

};
