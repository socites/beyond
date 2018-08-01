/**
 * Beyond is ready when the start code was completely executed
 * and when the events WebComponentsReady is triggered, required to process polymer components
 *
 * @param beyond
 * @param events
 */
let exposeReady = function (beyond, events) {

    let ready;
    Object.defineProperty(beyond, 'ready', {
        'get': function () {
            return ready;
        }
    });

    let callbacks = [];

    let coordinate = new Coordinate('webComponentsReady', 'startCode', function () {

        ready = true;
        events.trigger('ready');

        for (let i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    });

    let onStart = function () {

        events.unbind('start', onStart);
        coordinate.done('startCode');

    };

    events.bind('start', onStart);

    beyond.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

};
