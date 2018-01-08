function Behavior(module, specs) {
    "use strict";

    if (typeof specs !== 'object') {
        console.error('Invalid specification', specs);
        throw new Error('Invalid control specifications');
    }

    // Check control
    if (!specs.react) {
        specs.react = 'control';
    }
    if (typeof specs.react !== 'string' && (
        typeof specs.react !== 'object' ||
        (typeof specs.react.control !== 'string' && typeof specs.react.control !== 'function'))) {
        console.error('Invalid react specification', specs);
        throw new Error('Invalid react specification');
    }

    // Check sna function
    if (specs.creator && typeof specs.creator !== 'function') {
        console.error('Invalid creator specification', specs);
        throw new Error('Invalid creator specification');
    }

    var ready;
    // Do not use ready as this.ready is reserved to polymer
    Object.defineProperty(this, 'isReady', {
        'get': function () {
            return !!ready;
        }
    });

    function onDependenciesReady() {

        var dependencies = module.dependencies.modules;

        var creator = (typeof specs.creator === 'function') ? specs.creator() : undefined;
        var sna = new SNA(this, specs, creator, specs.properties, dependencies);

        // Check for already set properties
        var properties = sna.properties;
        properties.silence = true;
        for (var name in specs.properties) {
            properties[name] = this[name];
        }
        properties.silence = false;
        properties.refresh();

        // Set sna
        this._setSNA(sna);

        var react = {};
        if (typeof specs.react === 'string') {
            react.item = module.react.items[specs.react];
            react.properties = {'sna': sna};
        }
        else {

            if (typeof specs.react.control === 'string') {
                react.item = module.react.items[specs.react.control];
            }
            else {
                react.item = specs.react.control;
            }

            if (typeof specs.react.properties === 'object') {
                react.properties = specs.react.properties;
            }
            else if (typeof specs.react.properties === 'function') {
                react.properties = specs.react.properties();
            }

            if (typeof react.properties !== 'object') {
                react.properties = {};
            }

            react.properties.sna = sna;

        }

        if (!react.item) {
            console.error('Invalid react item, check specification', specs);
            throw new Error('Invalid react item');
        }

        var ReactDOM = dependencies.ReactDOM;

        react.element = module.React.createElement(react.item, react.properties);
        ReactDOM.render(react.element, this);

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = undefined;
        this.fire('ready');

    }

    var callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    /**
     * Polymer method executed when properties are set and local DOM is initialized.
     */
    this.ready = function () {

        var coordinate = new Coordinate(
            'dependencies',
            'react',
            Delegate(this, onDependenciesReady));

        module.dependencies.done(coordinate.dependencies);
        module.react.done(coordinate.react);

    };

    this._setSNA = function (value) {

        if (this._sna) {
            throw new Error('sna is already defined');
        }
        this._sna = value;

        var properties = this._sna.properties;
        properties.updateControl();

    };

    var setObserver = Delegate(this, function (name, property, observer) {

        var method = '_set' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Changed';
        property.observer = method;

        // Executed when property changed
        this[method] = function (value) {
            if (!this._sna) {
                return;
            }
            this._sna.properties[name] = value;
        };

    });

    this.properties = {};
    for (var name in specs.properties) {

        var spec = specs.properties[name];
        var property = {};

        if (spec.type) {
            property.type = spec.type;
        }

        spec.readOnly = (typeof spec.readOnly === 'boolean') ? spec.readOnly : false;
        if (!spec.readOnly) {
            setObserver(name, property, spec.observer);
        }

        property.notify = !!spec.notify;
        property.readOnly = spec.readOnly;

        this.properties[name] = property;

    }

    function onMethodExecuted(name) {

        if (!this._sna) {
            throw new Error('sna not set, wait for control to be ready');
        }

        if (typeof this._sna.actions[name] !== 'function') {
            throw new Error('actions must implement method "' + name + '"');
        }

        var args = [].slice.call(arguments);
        args.shift();

        return this._sna.actions[name].apply(this._sna, args);

    }

    for (var index in specs.methods) {

        var method = specs.methods[index];
        (function (behavior, method) {

            behavior[method] = function () {

                var args = [].slice.call(arguments);
                args.unshift(method);
                return onMethodExecuted.apply(this, args);

            };

        })(this, method);

    }

}
