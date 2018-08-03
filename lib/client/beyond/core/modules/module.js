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

    let path = new ModulePath(this);
    Object.defineProperty(this, 'path', {'get': () => path.path});
    Object.defineProperty(this, 'host', {'get': () => path.host});
    Object.defineProperty(this, 'src', {'get': () => path.src});

    // Check if the container is a library or the application
    let container = (path.container === 'application') ? beyond.application : beyond.libraries.get(path.library);
    Object.defineProperty(this, 'container', {'get': () => container});

    // Plugins used by the extensions
    let plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {'get': () => plugins});

    // The source location of the custom script
    let custom = (path.container === 'library') ? `application/custom/${path.library}/${path.path}` : undefined;
    Object.defineProperty(this, 'custom', {'get': () => custom});

    // Module dependencies
    let dependencies = new Dependencies(this);
    Object.defineProperty(this, 'dependencies', {'get': () => dependencies});
    Object.defineProperty(this, 'ready', {'get': () => dependencies.ready});
    this.done = () => dependencies.loaded();

};
