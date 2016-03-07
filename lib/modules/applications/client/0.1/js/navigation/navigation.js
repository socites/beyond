function Navigation(beyond) {
    "use strict";

    var errors = [];

    var events = new Events({'bind': this});

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    // set pathname as a property
    pathname(this, events);

    var controls = beyond.controls;
    Object.defineProperty(this, 'controls', {
        'get': function () {
            return controls;
        }
    });

    Object.defineProperty(this, 'active', {
        'get': function () {
            return controls.active;
        }
    });

    update = update(this, events);

    this.navigate = function (pathname, state, done) {

        var control = controls.getOrCreate({'pathname': pathname}, state);

        control.done(function () {

            if (control.error) {
                console.log(control.error);
                return;
            }

            control.show(state, function () {
                if (done) done();
            });

        });

    };

    beyond.bind('start', function () {

        ready = true;
        events.trigger('ready');

        update();
        window.addEventListener('popstate', update);

    });

}
