var Updater = function (navigation, events, controls) {
    "use strict";

    var error = function (code) {

        if (message) console.error('navigation error', navigation.pathname, code);
        events.trigger('error', code);

    };

    var update = function (control, state, done) {

        var show = function () {

            var timer = setTimeout(function () {
                console.warn('controller callback not called', control.moduleID);
            }, 5000);

            control.controller.show(state, function () {
                clearTimeout(timer);
                if (done) done(control);
            });

        };

        var previous = beyond.navigation.active;
        if (previous) {

            if (previous.type === 'slave') {

                if (control.type === 'slave') {

                    if (previous.master.pathname !== control.master.pathname)
                        previous.master.hide(show);
                    else show();

                } else {

                    if (previous.master.pathname !== control.pathname)
                        previous.master.hide(show);
                    else show();

                }

            }
            else {

                if (control.type === 'slave') {

                    if (previous.pathname !== control.master.pathname)
                        previous.master.hide(show);
                    else show();

                }
                else {

                    if (previous.pathname !== control.pathname)
                        previous.master.hide(show);
                    else show();

                }

            }

            // hide previous master and once it is hidden, then show the new control
            previous.hide(show);

        }
        else show();

    };

    this.update = function (state, done) {

        if (!navigation.ready) {
            console.error('wait for navigation to be ready');
            return;
        }

        var pathname = beyond.navigation.pathname;

        controls.show(pathname, state, function (control, state) {

            if (!control) {
                error('404');
                done();
            }
            else {
                update(control, state, done);
                done();
            }

        });

    };

};
