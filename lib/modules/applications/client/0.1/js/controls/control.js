function Control(ID, specs, state, events, controls) {
    "use strict";

    var self = this;

    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

    var moduleID;
    Object.defineProperty(this, 'moduleID', {
        'get': function () {
            return moduleID;
        }
    });

    var pathname;
    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return pathname;
        }
    });

    if (!specs.moduleID && !specs.pathname) {
        error = 'Invalid control specification';
        done();
        return;
    }
    if (specs.moduleID && specs.pathname) {
        error = 'Just one of moduleID and pathname parameters must be specified';
        done();
        return;
    }

    if (specs.moduleID) moduleID = specs.moduleID;
    if (specs.pathname) pathname = specs.pathname;

    if (pathname.substr(0, 1) !== '/') pathname = '/' + pathname;

    var type, controller, error;
    Object.defineProperty(this, 'type', {
        'get': function () {
            return type;
        }
    });
    Object.defineProperty(this, 'controller', {
        'get': function () {
            return controller;
        }
    });
    Object.defineProperty(this, 'error', {
        'get': function () {
            return error;
        }
    });

    var processed;
    Object.defineProperty(this, 'processed', {
        'get': function () {
            return !!processed;
        }
    });

    var callbacks = [];

    var done = function () {

        processed = true;

        for (var i in callbacks) callbacks[i]();
        callbacks = [];

    };

    this.done = function (callback) {

        if (processed) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    var open = function () {

        if (!type) type = 'screen';
        if (type && ['screen', 'surface'].indexOf(type) === -1) {

            error = 'Invalid control type, it is not a screen or a surface';
            done();
            return;

        }

        require([moduleID], function (module) {

            if (typeof module !== 'object') {

                error = 'Module does not export an object';
                done();
                return;

            }

            var Controller = module.Control;
            if (!Controller) {

                error = 'Invalid controller. Module must expose an object with a "Control" attribute.';
                done();
                return;

            }

            if (type === 'screen') Screen.call(self, events, controls);
            else Surface.call(self, events, controls);

            controller = new Controller(self);
            if (typeof controller.show !== 'function') {

                error = 'Controller does not specify a show method';
                done();
                return;

            }

            if (type === 'screen') done();
            else self.screen.done(function () {
                done();
            });

        });

    };

    // set default route for the home page
    if (pathname === '/' && typeof beyond.params.routes === 'object') {

        var defaultRoutes = beyond.params.routes.default;
        if (typeof defaultRoutes === 'string') {
            pathname = defaultRoutes;
        }
        else if (typeof defaultRoutes === 'object') {
            if (auth.session.valid && typeof defaultRoutes.signedin === 'string') {
                pathname = defaultRoutes.signedin;
            }
            else if (!auth.session.valid && typeof defaultRoutes.signedout === 'string') {
                pathname = defaultRoutes.signedout;
            }
        }

    }

    if (pathname.substr(0, 1) !== '/') pathname = '/' + pathname;
    if (!pathname) {

        error = 'Module ID "' + moduleID + '" is not a control';
        done();
        return;

    }
    specs.pathname = pathname;

    var controlDef = controls.modules.get(specs);
    if (controlDef) {

        moduleID = controlDef.moduleID;
        type = controlDef.type;
        pathname = controlDef.pathname;
        open();
        return;

    }

    events.trigger({'event': 'routing', 'async': true}, pathname, state, function (controlDef) {

        if (!controlDef) {

            error = 'Pathname "' + pathname + '" does not have a module associated.';
            done();
            return;

        }

        moduleID = controlDef.moduleID;
        type = controlDef.type;

        open();

    });

}
