function Control(name, specs) {

    Object.defineProperty(this, 'name', {'get': () => name});

    let path = new ControlPath(name, specs.path, specs.type);
    Object.defineProperty(this, 'path', {'get': () => path.value});

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    let importing, imported;
    Object.defineProperty(this, 'importing', {'get': () => !!importing});
    Object.defineProperty(this, 'imported', {'get': () => !!imported});

    this.import = function () {

        if (importing || imported) return promise;

        importing = true;
        window.Polymer.Base.importHref(path.value, function () {
            importing = false;
            imported = true;
            resolve();
        });

        return promise;

    };

}
