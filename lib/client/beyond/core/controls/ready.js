function ControlsReady() {

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    let ready;
    Object.defineProperty(this, 'promise', {'get': () => promise});

    function done() {
        clearInterval(timer);
        (!ready) ? resolve() : null;
        ready = true;
    }

    // Sometimes WebComponentsReady event is not triggered
    window.addEventListener('WebComponentsReady', done);

    // Keep checking
    let timer = setInterval(function () {
        if (window.Polymer && window.Polymer.Base &&
            typeof window.Polymer.Base.importHref === 'function') done();
    }, 50);

}
