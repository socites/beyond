function update(navigation, events) {
    "use strict";

    var controls = navigation.controls;

    return function () {

        var pathname = navigation.pathname;
        var control = controls.getOrCreate({'pathname': pathname});

        var state = history.state;

        control.done(function () {

            control.show(state, function () {

                events.trigger('navigate:end');

            }, true);

        });

    };

}
