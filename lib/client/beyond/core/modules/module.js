let Module = function (id, loaded) {

    let loader = new ModuleLoader(this, loaded);
    Object.defineProperty(this, 'loaded', {'get': () => loader.loaded});
    this.require = () => loader.require();

    // Check if id has trailing slash
    if (/.\/$/.test(id)) {
        console.warn('Module id should not have trailing slash');
        id = id.replace(/\/$/, '');
    }

    if (id.substr(0, 12) !== 'application/' && id.substr(0, 10) !== 'libraries/') {
        throw new Error(`Invalid module id "${id}"`);
    }

    Object.defineProperty(this, 'id', {'get': () => id});

    let multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': () => !!multilanguage,
        'set': (value) => {
            if (multilanguage !== undefined) {
                console.warn(`Multilanguage attribute on bundle "${module}" should not be set twice`);
            }
            multilanguage = !!value;
        }
    });

    // Set the location of the source code of the module
    let src = `${id + (!!multilanguage) ? '/' + beyond.params.language : ''}`;
    Object.defineProperty(this, 'src', {'get': () => src});

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

    // Plugins used by the extensions
    let plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {'get': () => plugins});

    // The source location of the custom script
    let custom = (library) ? `application/custom/${library.name}/${this.path}` : undefined;
    Object.defineProperty(this, 'custom', {'get': () => custom});

    // Module dependencies
    let dependencies = new Dependencies(this);
    Object.defineProperty(this, 'dependencies', {'get': () => dependencies});
    Object.defineProperty(this, 'ready', {'get': () => dependencies.ready});
    this.done = () => dependencies.loaded();

};
