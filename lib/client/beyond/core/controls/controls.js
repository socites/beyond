function Controls() {

    let ready = new ControlsReady();
    Object.defineProperty(this, 'ready', {'get': () => ready.value});

    let controls = new Map();
    Object.defineProperty(this, 'list', {'get': () => controls});

    this.register = function (register) {

        for (let name in register) {

            if (!register.hasOwnProperty(name)) continue;
            if (controls.has(name)) {
                console.warn(`Control "${name}" is already registered`);
            }

            let path = register[name];
            controls.set(name, new Control(name, path));

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
