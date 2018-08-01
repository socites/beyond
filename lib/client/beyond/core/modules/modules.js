let Modules = function (events) {
    'use strict';

    let loaded = new Set();
    Object.defineProperty(this, 'loaded', {
        'get': () => loaded
    });

    let modules = new Map();
    Object.defineProperty(this, 'values', {
        'get': () => modules.values()
    });
    Object.defineProperty(this, 'keys', {
        'get': () => modules.keys()
    });
    Object.defineProperty(this, 'size', {
        'get': () => modules.size
    });

    this.get = function (moduleId, extendedId) {

        let extended;
        if (extendedId) {
            extended = modules.get(extendedId);
            if (!extended) {
                extended = new Module(moduleId, events);
                modules.set(extendedId, extended);
            }
        }

        let module;
        if (modules.has(moduleId)) {
            module = modules.get(moduleId);
        } else {
            module = new Module(moduleId, events);
            modules.set(moduleId, module);
        }

        if (extended) {
            return [module, extended];
        }
        else {
            return [module, () => loaded.add(moduleId)];
        }

    };

};
