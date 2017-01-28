var Phonegap = function () {

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var callbacks = [];

    function onDeviceReady() {

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }

        callbacks = [];

    }

    document.addEventListener('deviceready', onDeviceReady);

    this.done = function (callback) {

        if (typeof callback !== 'function') {
            console.error('Invalid callback function.');
            return;
        }

        if (ready) {
            callback();
        }
        else {
            callbacks.push(callback);
        }

    };

};

window.beyond.phonegap = new Phonegap();
