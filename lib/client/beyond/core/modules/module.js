let Module = function (id, events) {

    // Check if id has trailing slash
    if (/.\/$/.test(id)) {
        console.warn('Module id should not have trailing slash');
        id = id.replace(/\/$/, '');
    }

    Object.defineProperty(this, 'id', {'get': () => id});

    // Get the library of the module if the container is a library
    let library;
    let path = id.split('/');
    library = (path[0] === 'libraries') ? beyond.libraries.get(path[1]) : undefined;
    Object.defineProperty(this, 'library', {'get': () => library});

    // Check if the container is a library or the application
    let container = (library) ? library : beyond.application;
    Object.defineProperty(this, 'container', {'get': () => container});

    // Remove /libraries/library or /application from path
    (library) ? path.splice(0, 2) : path.splice(0, 1);
    path = path.join('/');
    path += (library && path === library.path) ? '/main' : '';
    Object.defineProperty(this, 'path', {'get': () => path});

    Object.defineProperty(this, 'hosts', {'get': () => container.hosts});

    let plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {'get': () => plugins});

    let bundles = new Bundles(this);
    Object.defineProperty(this, 'bundles', {'get': () => bundles});

    let custom = (library) ? `application/custom/${library.name}/${this.path}` : undefined;
    Object.defineProperty(this, 'custom', {'get': () => custom});

    // Module supports dependencies
    let dependencies = new Dependencies(this);
    Object.defineProperty(this, 'dependencies', {'get': () => dependencies});
    Object.defineProperty(this, 'ready', {'get': () => dependencies.ready});
    this.done = function () {
        return dependencies.done();
    };

};
