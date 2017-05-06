function Behavior(module, specs) {
    "use strict";

    if (typeof specs !== 'object') {
        throw new Error('Invalid control specifications');
    }
    if (typeof specs.react !== 'string') {
        throw new Error('Invalid react item specification');
    }

    function onDependenciesReady() {

        var dependencies = module.dependencies.modules;

        var sna;
        if (specs.SNA) {
            sna = new specs.SNA(dependencies);

            // Check for already set properties
            for (var name in specs.properties) {
                var spec = specs.properties[name];
                if (spec.observer && this[name]) {

                    if (!sna[spec.observer]) {
                        console.error('sna must implement observer function "' + observer +
                            '" as is declared in the property "' + name + '"');
                        continue;
                    }
                    sna[spec.observer](this[name]);

                }
            }

            this._setSNA(sna);
        }

        var reactItem = module.react.items[specs.react];
        if (!reactItem) {
            throw new Error('Invalid react item "' + specs.react + '"');
        }

        var ReactDOM = dependencies.ReactDOM;

        var reactElement = module.React.createElement(reactItem, {
            'sna': sna
        });
        ReactDOM.render(reactElement, this);

    }

    this.ready = function () {

        var coordinate = new Coordinate(
            'dependencies',
            'react',
            Delegate(this, onDependenciesReady));

        module.dependencies.done(coordinate.dependencies);
        module.react.done(coordinate.react);

    };

    this._onSNAChanged = function () {

        var sna = this._sna;
        if (!sna.state) {
            return;
        }

        for (var name in specs.properties) {

            var spec = specs.properties[name];
            if (spec.value) {

                var value = sna.state[spec.value];

                if (value === this[name]) {
                    continue;
                }

                if (spec.readOnly) {

                    var method = '_set' +
                        name.substr(0, 1).toUpperCase() +
                        name.substr(1);

                    this[method](value);

                }
                else {
                    this[name] = value;
                }

            }

        }

    };

    this._setSNA = function (value) {

        if (this._sna) {
            throw new Error('sna is already defined');
        }
        this._sna = value;

        this._sna.bind('change', Delegate(this, this._onSNAChanged));

    };

    var setObserver = Delegate(this, function (name, property, observer) {

        var method = '_set' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Changed';
        property.observer = method;

        // Executed when property changed
        this[method] = function (value) {

            if (!this._sna) {
                return;
            }

            if (typeof this._sna[observer] !== 'function') {
                console.error('sna must implement observer function "' + observer +
                    '" as is declared in the property "' + name + '"');
                return;
            }

            this._sna[observer](value);

        };

    });

    this.properties = {};
    for (var name in specs.properties) {

        var spec = specs.properties[name];
        var property = {};

        if (spec.type) {
            property.type = spec.type;
        }

        if (spec.observer) {
            setObserver(name, property, spec.observer);
        }

        property.readOnly = (!!spec.readOnly || (!!spec.value && !spec.observer));

        if (spec.value) {
            property.notify = !!spec.notify;
        }
        else if (spec.notify) {
            throw new Error('Cannot specify the "notify" attribute as true, if the attribute "value" is not set');
        }

        this.properties[name] = property;

    }

    function onMethodExecuted(name) {

        if (!this._sna) {
            throw new Error('sna not set, wait for control to be ready');
        }

        if (typeof this._sna[name] !== 'function') {
            throw new Error('sna must implement method "' + name + '"');
        }

        var args = [].slice.call(arguments);
        args.shift();

        this._sna[name].apply(this._sna, args);

    }

    for (var index in specs.methods) {

        var method = specs.methods[index];
        (function (behavior, method) {

            behavior[method] = function () {

                var args = [].slice.call(arguments);
                args.unshift(method);
                onMethodExecuted.apply(this, args);

            };

        })(this, method);

    }

}
