function Control(name, specs) {

    Object.defineProperty(this, 'name', {'get': () => name});

    let path = new ControlPath(specs.type, specs.path);
    Object.defineProperty(this, 'path', {'get': () => path.value});

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    window.Polymer.Base.importHref(path.value, function () {
        resolve();
    });

    this.loaded = function () {
        return promise;
    };

}
