function Control(name, specs) {

    Object.defineProperty(this, 'name', {'get': () => name});

    let path = new ControlPath(specs.type, specs.path);
    Object.defineProperty(this, 'path', {'get': () => path.value});

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    let loading, loaded;
    Object.defineProperty(this, 'loading', {'get': () => !!loading});
    Object.defineProperty(this, 'loaded', {'get': () => !!loaded});

    this.require = function () {

        if (loading || loaded) return promise;

        loading = true;
        window.Polymer.Base.importHref(path.value, function () {
            loading = false;
            loaded = true;
            resolve();
        });

        return promise;

    };

}
