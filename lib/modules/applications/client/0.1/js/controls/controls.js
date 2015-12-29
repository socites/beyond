function Controls(controlsConfig, events) {
    "use strict";

    var incrementalID = 0;
    var controls = {};

    var modules = new ModulesControls(controlsConfig);
    Object.defineProperty(this, 'modules', {
        'get': function () {
            return modules;
        }
    });

    var activeScreen, activeControl;
    Object.defineProperty(this, 'activeScreen', {
        'get': function () {
            return activeScreen;
        },
        'set': function (control) {

            if (control.type !== 'screen') {
                console.error('Control is not a screen');
                return;
            }

            activeScreen = control;

        }
    });

    Object.defineProperty(this, 'activeControl', {
        'get': function () {
            return activeControl;
        },
        'set': function (control) {

            activeControl = control;

        }
    });

    this.create = function (specs, state) {

        var control;

        if (specs.pathname) {

            control = this.getByPathname(specs.pathname);
            if (control)
                throw new Error('Control with pathname "' + specs.pathname + '" already exists');

        }

        incrementalID++;
        control = new Control(incrementalID, specs, state, events, this);

        controls[incrementalID] = control;

        return control;

    };

    this.getByID = function (ID) {
        return controls[ID];
    };

    this.getByPathname = function (pathname) {

        for (var ID in controls)
            if (controls[ID].pathname === pathname)
                return controls[ID];

    };

    this.get = function (specs) {

        if (specs.ID) return this.getByID(specs.ID);
        else if (specs.pathname) return this.getByPathname(specs.pathname);

    };

    this.getOrCreate = function (specs, state) {

        var control;

        control = this.get(specs);
        if (control) return control;

        return this.create(specs, state);

    };

}
