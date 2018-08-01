function Controls() {

    let events = new Events({'bind': this});

    let ready = new ControlsReady();
    Object.defineProperty(this, 'ready', {'get': () => ready.value});

    let controls = new Map();
    Object.defineProperty(this, 'list', {'get': () => controls});

    this.register = function (library, register) {

        for (let name in register) {

            if (!register.hasOwnProperty(name)) continue;

            let specs = register[name];
            if (typeof specs === 'string') {
                specs = {'path': specs};
            }
            specs.path = `libraries/${library}/${specs.path}`;

            if (controls.has(name)) {
                console.warn(`Control "${name}" is already registered`);
            }
            controls.set(name, new Control(name, specs));

        }

    };

    this.import = function (values) {

        if (!(values instanceof Array)) {
            values = [values];
        }

        let promises = [];
        for (let control of values) {

            if (!controls.has(control)) {
                console.error(`Control "${control}" is not registered`);
                return;
            }

            promises.push(controls.get(control).loaded());

        }

        return Promise.all(promises);

    };

}
