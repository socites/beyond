function Extensions() {

    let extensions = new Map();
    Object.defineProperty(this, 'values', {'get': () => extensions.values()});
    Object.defineProperty(this, 'keys', {'get': () => extensions.keys()});
    Object.defineProperty(this, 'size', {'get': () => extensions.size});

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
