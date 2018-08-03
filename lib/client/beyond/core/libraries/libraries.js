function Libraries(beyond) {

    let libraries = new Map();
    Object.defineProperty(this, 'values', {'get': () => libraries.values()});
    Object.defineProperty(this, 'keys', {'get': () => libraries.keys()});
    Object.defineProperty(this, 'size', {'get': () => libraries.size});

    let extensions = new Extensions();
    let handler = new ExtensionsHandler(extensions);

    this.has = (name) => libraries.has(name);

    this.get = function (name) {

        if (libraries.has(name)) {
            return libraries.get(name);
        }

        let target = new Library(beyond, name);

        let library = new Proxy(target, handler);
        libraries.set(name, library);

        return library;

    };

    this.extend = (name, extension) => extensions.register(name, extension);

}
