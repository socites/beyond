module.exports = function (config, runtime) {

    let items = {}, keys = [];
    Object.defineProperty(this, 'items', {'get': () => items});
    Object.defineProperty(this, 'keys', {'get': () => keys});
    Object.defineProperty(this, 'length', {'get': () => keys.length});

    let initialised;
    this.initialise = async function () {

        if (initialised) return;
        initialised = true;

        for (let name in config.items) {

            if (!config.items.hasOwnProperty(name)) continue;

            let library = config.items[name];
            library = new (require('./library.js'))(name, library, runtime);
            if (!library.valid) continue;

            await library.initialise();
            if (!library.valid) continue;

            keys.push(name);
            items[name] = library;

        }

    };

};
