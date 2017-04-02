function ReactRegister(module, events) {
    "use strict";

    // jsx register functions that creates the React elements
    // this is done this way because React.createElement cannot be called until
    // React is loaded by requirejs
    var registeredFunctions = {};

    var React, ReactDOM;

    var items = {};
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });

    var ready;
    var loading;
    Object.defineProperty(this, 'loading', {
        'get': function () {
            return loading;
        }
    });

    var loadDependencies = function () {

        require(['react', 'react-dom'], function (_React, _ReactDOM) {

            React = _React;
            ReactDOM = _ReactDOM;

            module.React = React;
            module.ReactDOM = ReactDOM;

            for (var key in registeredFunctions) {
                items[key] = registeredFunctions[key]();
            }

            loading = false;
            ready = true;

            for (var i in callbacks) {
                callbacks[i]();
            }
            callbacks = [];

            events.trigger('react:ready');

        });

    };

    var checkDependencies = function () {

        if (ready || loading) {
            return;
        }

        loading = true;

        // the timeout is to avoid MISMATCHED ANONYMOUS DEFINE (requirejs)
        setTimeout(loadDependencies, 0);

    };

    this.register = function (key, createElementFnc) {

        checkDependencies();

        if (!ready) {
            registeredFunctions[key] = createElementFnc;
            return;
        }

        items[key] = createElementFnc();

    };

    var callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    this.createControl = function (specs) {
        "use strict";

        if (!React) {
            console.error('Wait for React to be ready');
            return;
        }

        if (!specs || typeof specs.render !== 'function') {
            console.warn('Invalid control specification');
        }

        return React.createClass({

            'getInitialState': function () {

                if (typeof this.props.sna !== 'object') {
                    console.warn('sna is invalid or not set');
                    return null;
                }

                this.sna = this.props.sna;
                this.extended = this.props.extended;

                if (typeof this.sna.actions !== 'object') {
                    console.warn('sna actions are invalid or not defined');
                }
                else {
                    this.actions = this.sna.actions;
                }

                if (typeof this.sna.state !== 'object') {
                    console.warn('sna state is invalid or not defined');
                    return null;
                }

                return this.sna.state;

            },
            '_onChange': function () {

                if (typeof this.sna.state !== 'object') {
                    console.warn('sna state is invalid or not defined');
                    return null;
                }

                if (typeof this.sna.actions !== 'object') {
                    console.warn('sna actions are invalid or not defined');
                }
                else {
                    this.actions = this.sna.actions;
                }

                this.setState(this.sna.state);

            },
            'componentDidMount': function () {

                if (!this.sna || !this.sna.bind) return;
                this.sna.bind('change', this._onChange);

                if (!specs || !specs.componentDidMount) return null;
                return specs.componentDidMount.call(this, specs);

            },
            'componentWillUnmount': function () {

                if (!this.sna || !this.sna.unbind) return;
                this.sna.unbind('change', this._onChange);

                if (!specs || !specs.componentWillUnmount) return null;
                return specs.componentWillUnmount.call(this, specs);

            },
            'componentWillUpdate': function () {

                if (!specs || !specs.componentWillUpdate) return null;
                return specs.componentWillUpdate.call(this, specs);

            },
            'componentDidUpdate': function () {

                if (!specs || !specs.componentDidUpdate) return null;
                return specs.componentDidUpdate.call(this, specs);

            },
            'render': function () {

                if (!specs || !specs.render) return null;

                specs.extended = this.props.extended;
                return specs.render.call(specs, this.state, this.actions, this);

            }

        });

    }

}
