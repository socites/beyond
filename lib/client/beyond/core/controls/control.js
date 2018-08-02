function Control(name, specs) {

    Object.defineProperty(this, 'name', {'get': () => name});

    let path = new ControlPath(name, specs.path, specs.type);
    Object.defineProperty(this, 'path', {'get': () => path.value});

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
