function Controls() {

    let events = new Events({'bind': this});

    let ready = new ControlsReady();
    Object.defineProperty(this, 'ready', {'get': () => ready.value});

    let controls = new Map();
    Object.defineProperty(this, 'list', {'get': () => controls});

    this.register = function (register) {

        for (let name in register) {

            let specs = register[name];
            if (typeof specs === 'string') {
                specs = {'path': specs};
            }

            controls.set(name, new Control(name, specs));

        }

    };

    this.import = function (values) {

        let promises = [];
        for (let control of values) {

            control = controls[control];
            if (!control) {
                console.error(`Control "${control}" is not registered`);
                return;
            }

            promises.push(control.loaded());

        }

        return Promise.all(promises);

    };

}
