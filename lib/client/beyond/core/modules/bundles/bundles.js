function Bundles(module) {

    let bundles = new Map();
    Object.defineProperty(this, 'keys', {'get': () => bundles.keys()});
    Object.defineProperty(this, 'values', {'get': () => bundles.values()});
    Object.defineProperty(this, 'size', {'get': () => bundles.size});

    this.has = function (name) {
        return bundles.has(name);
    };

    this.get = function (name) {

        if (bundles.has(name)) {
            return bundles.get(name);
        }

        let bundle = new Bundle(module, name);
        bundles.set(name, bundle);

        return bundle;

    };

}
