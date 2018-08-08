function Dependencies(module) {

    let promise;
    Object.defineProperty(this, 'loaded', {'get': () => promise});

    let modules = {};
    Object.defineProperty(this, 'modules', {'get': () => modules});

    let initialised;
    this.set = function (dependencies) {

        if (initialised) throw new Error('Module dependencies can only be set once');
        initialised = true;

        if (dependencies.code && typeof dependencies.code !== 'object') {
            console.warn(`Invalid code dependencies on module "${module.id}"`);
            dependencies.code = {};
        }
        if (dependencies.controls && !(dependencies.controls instanceof Array)) {
            console.warn(`Invalid controls dependencies on module "${module.id}"`);
        }

        modules = beyond.require(dependencies.code);

        promise = Promise.all([
            modules,
            beyond.controls.import(dependencies.controls)
        ]);

    };

}
