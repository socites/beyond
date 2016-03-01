function update(navigation, events) {
    "use strict";

    var controls = navigation.controls;

    return function () {

        var pathname = navigation.pathname;
        var control = controls.getOrCreate({'pathname': pathname});

        if (control.error) {
            console.log('Error on control.', control.error);
            return;
        }

        var state = history.state;

        control.done(function () {

            if (control.error) {
                console.error('module "' + control.moduleID + '" error: ' + control.error);
                return;
            }

            control.show(state, function () {

                events.trigger('navigate:end');

            }, true);

        });

    };

}
