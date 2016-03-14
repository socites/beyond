function Screen(events, controls) {
    "use strict";

    Object.defineProperty(this, 'active', {
        'get': function () {
            return controls.activeScreen && controls.activeScreen.ID === this.ID;
        }
    });

    var surfaces = new SurfacesProxy(events, controls);
    Object.defineProperty(this, 'surfaces', {
        'get': function () {
            return surfaces;
        }
    });

    this.show = function (state, done, keepState) {

        this.state = state;

        if (controls.activeScreen) controls.activeScreen.hide();

        if (this.pathname && beyond.pathname !== this.pathname) {

            // set the url considering if its local navigation or not
            var url = this.pathname;
            var params = beyond.params;
            if (beyond.params.local) url = '/' + params.name + '/' + params.language + url;

            if (state && state.JSON) history.pushState({
                'type': 'screen',
                'state': state.JSON
            }, '', url);
            else history.pushState({
                'type': 'screen',
                'state': state
            }, '', url);

        }
        else if (this.pathname && !keepState) {

            if (state && state.JSON) history.replaceState({
                'type': 'screen',
                'state': state.JSON
            });
            else history.replaceState({
                'type': 'screen',
                'state': state
            });

        }

        this.controller.show(state, function () {
            if (done) done();
        });

        controls.activeScreen = this;

    };

    this.hide = function () {

        if (!this.active) return;

        this.controller.hide();
        surfaces.hide();

    };

}
