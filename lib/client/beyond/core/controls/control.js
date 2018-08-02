function Control(name, module) {

    Object.defineProperty(this, 'name', {'get': () => name});

    this.import = () => new Promise(function (resolve) {

        let src = beyond.modules.get(module)[0].src;
        window.Polymer.Base.importHref(src, function () {
            resolve();
        });

    });

}
