function Phonegap() {

    Object.defineProperty(this, 'isPhonegap', {
        'get': () => (!!window.cordova || !!window.PhoneGap || !!window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent)
    });

    let ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    let callbacks = [];

    function onDeviceReady() {

        ready = true;
        for (let i in callbacks) {
            try {
                callbacks[i]();
            }
            catch (exc) {
                console.log(exc.stack);
            }
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

}

window.beyond.phonegap = new Phonegap();
