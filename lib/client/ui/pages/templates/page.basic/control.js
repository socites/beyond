function Control($container, name) {
    'use strict';

    if (typeof name !== 'string') {
        console.warn('Control name specification is invalid');
        return;
    }

    Object.defineProperty(this, 'valid', {'get': () => $control.length === 1});

    Object.defineProperty(this, 'control', {'get': () => control});

    Object.defineProperty(this, '$control', {'get': () => $control});

    let $control = $('<' + name + '/>').addClass('content');
    $container.append($control);
    let control = $control.get(0);

    // Load the control if not previously loaded
    beyond.controls.import([name]);

    let ready;
    Object.defineProperty(this, 'ready', {'get': () => !!ready});

    function onControlReady() {

        ready = true;
        new Toolbar($container, control);

    }

    let promise = new Promise(function (resolve) {

        if (control.ready) {
            control.done(() => {
                onControlReady();
                resolve();
            });
        }
        else {
            control.addEventListener('ready', () => {
                control.done(() => {
                    onControlReady();
                    resolve();
                });
            })
        }

    });

    this.done = () => {
        return promise;
    };

}
