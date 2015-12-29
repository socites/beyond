function Surface(events, controls) {
    "use strict";

    Object.defineProperty(this, 'active', {
        'get': function () {
            return controls.activeControl && controls.activeControl.ID === this.ID;
        }
    });

    var screen = new ScreenProxy(this, events, controls);
    Object.defineProperty(this, 'screen', {
        'get': function () {
            return screen;
        }
    });

    Object.defineProperty(this, 'orphan', {
        'get': function () {
            return !screen.control;
        }
    });

    this.show = function (state, done, keepState) {

        this.state = state;

        var coordinate = new Coordinate('screen', 'surface', function () {
            if (done) done();
        });

        if (this.orphan) {
            console.error('Cannot show this surface, as its screen is not defined');
            return;
        }

        if (!controls.activeScreen || controls.activeScreen.ID !== this.screen.control.ID) {

            if (controls.activeScreen) controls.activeScreen.hide();
            controls.activeScreen = screen.control;

            screen.control.controller.show(state, function () {
                coordinate.done('screen');
            });

        }

        if (this.pathname && beyond.pathname !== this.pathname) {

            // set the url considering if its local navigation or not
            var url = this.pathname;
            var params = beyond.params;
            if (beyond.params.local) url = '/' + params.name + '/' + params.language + url;

            history.pushState({
                'type': 'surface',
                'state': state,
                'screen': screen.state
            }, '', url);

        }
        else if (this.pathname && !keepState) {

            if (state.JSON)
                history.replaceState({
                    'type': 'surface',
                    'state': state.JSON,
                    'screen': screen.state
                }, '');
            else
                history.replaceState({
                    'type': 'surface',
                    'state': state,
                    'screen': screen.state
                }, '');

        }

        this.controller.show(state, function () {
            if (done) done();
            coordinate.done('surface');
        });

    };

    this.hide = function () {

        this.controller.hide();

    };

}
