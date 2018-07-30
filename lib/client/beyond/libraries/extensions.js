function LibrariesExtensions() {

    let extensions = new Map();
    Object.defineProperty(this, 'values', {'get': () => libraries.values()});
    Object.defineProperty(this, 'keys', {'get': () => libraries.keys()});
    Object.defineProperty(this, 'size', {'get': () => libraries.size});

    this.register = function (name, extension) {
        extensions.set(name, extension);
    };

    this.has = function (name) {
        return extensions.has(name);
    };

    this.get = function (name) {
        return extensions.get(name);
    };

}
