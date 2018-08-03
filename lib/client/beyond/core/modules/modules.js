let Modules = function (events) {

    let modules = new Map();
    Object.defineProperty(this, 'values', {'get': () => modules.values()});
    Object.defineProperty(this, 'keys', {'get': () => modules.keys()});
    Object.defineProperty(this, 'size', {'get': () => modules.size});

    function get(id) {

        if (modules.has(id)) {
            return modules.get(id);
        }

        // Used inside the module object to detect when the module is loaded
        let callback = function () {
            callback.loaded = true;
            callback.callback();
        };

        let module = new Module(id, callback);
        let output = {'module': module, 'callback': callback};
        modules.set(id, output);

        return output;

    }

    /**
     * Used by the bundle to get the module object.
     *
     * @param moduleId {string} The module id.
     * @param extendedId {string=} When the module is an extension, this parameter refers
     * to the module id of the module being extended
     * @returns {*[]}
     */
    this.get = function (moduleId, extendedId) {

        let extended = (extendedId) ? get(extendedId).module : undefined;
        let module = get(moduleId);

        return [module.module, module.callback, extended];

    };

    this.has = (id) => modules.has(id);

};
