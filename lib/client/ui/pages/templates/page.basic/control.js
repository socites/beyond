function Control(name) {
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
    var control = $control.get(0);

    // Load the control if not previously loaded
    beyond.controls.import([name]);

    this.done = function () {

        return new Promise(function (resolve) {

            if (control.ready) {
                control.done(resolve);
            }
            else {
                control.addEventListener('ready', function () {
                    control.done(resolve);
                })
            }

        });

    };

}
