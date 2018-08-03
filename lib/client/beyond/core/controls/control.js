function Control(name, module, ready) {

    Object.defineProperty(this, 'name', {'get': () => name});

    this.import = () => new Promise(function (resolve) {

        ready.then(function () {
            let src = beyond.modules.get(module)[0].src;
            window.Polymer.Base.importHref(src, function () {
                resolve();
            });
        }).catch(function () {
            reject(new Error(`Control "${name}" cannot be loaded, Polymer is not ready`));
        });

    });

}
