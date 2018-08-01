function ControlsReady() {

    let resolve, reject;
    this.done = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    let ready;
    Object.defineProperty(this, 'value', {'get': () => !!ready});

    function done() {
        clearInterval(timer);
        (!ready) ? resolve() : null;
        ready = true;
    }

    // Sometimes WebComponentsReady event is not triggered
    window.addEventListener('WebComponentsReady', done);

    // Keep checking
    let timer = setInterval(function () {

        if (!window.Polymer || !window.Polymer.Base ||
            typeof window.Polymer.Base.importHref !== 'function') return;

        clearInterval(timer);
        done();

    }, 200);

}
