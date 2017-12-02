function Control(template, name) {
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

    Object.defineProperty(template, 'control', {
        'get': function () {
            return control;
        }
    });
    Object.defineProperty(template, '$control', {
        'get': function () {
            return $control;
        }
    });

    var $control = $('<' + name + '/>');
    var control = $control.get(0);

    this.done = function () {

        return new Promise(function (resolve) {

            if ($control.length !== 1) {
                resolve();
                return;
            }

            if (control.ready) {
                resolve();
            }
            else {
                control.addEventListener('ready', function () {
                    control.done(resolve);
                })
            }

        });

    };

}
