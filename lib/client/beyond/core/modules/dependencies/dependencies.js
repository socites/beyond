function Dependencies(module) {

    let modules = new Map();
    Object.defineProperty(this, 'keys', {'get': () => modules.keys()});
    Object.defineProperty(this, 'values', {'get': () => modules.values()});
    Object.defineProperty(this, 'size', {'get': () => modules.size});

    let code = new CodeDependencies();
    let controls = new ControlsDependencies();

    Object.defineProperty(this, 'loaded', {
        'get': () => Promise.all([code.loaded, controls.loaded])
    });

    let initialised;
    this.set = function (dependencies) {
        if (initialised) throw new Error('Module dependencies can only be set once');
        initialised = true;
        code.set(dependencies.code);
        controls.set(dependencies.controls);
    };

}
