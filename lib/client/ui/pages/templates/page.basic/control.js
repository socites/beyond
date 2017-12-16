function Control($container, name) {
    "use strict";

    if (typeof name !== 'string') {
        console.warn('Control name specification is invalid');
        return;
    }

    Object.defineProperty(this, 'valid', {
        'get': function () {
            return $control.length === 1;
        }
    });

    Object.defineProperty(this, 'control', {
        'get': function () {
            return control;
        }
    });
    Object.defineProperty(this, '$control', {
        'get': function () {
            return $control;
        }
    });

    var $control = $('<' + name + '/>').addClass('content');
    $container.append($control);
    var control = $control.get(0);

    // Load the control if not previously loaded
    beyond.controls.import([name]);

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return !!ready;
        }
    });

    function onControlReady() {

        ready = true;
        new Toolbar($container, control);

    }

    var promise = new Promise(function (resolve) {

        if (control.ready) {
            control.done(function () {
                onControlReady();
                resolve();
            });
        }
        else {
            control.addEventListener('ready', function () {
                control.done(function () {
                    onControlReady();
                    resolve();
                });
            })
        }

    });

    this.done = function () {
        return promise;
    };

}
