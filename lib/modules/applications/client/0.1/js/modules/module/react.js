function ReactRegister(module, events) {

    // jsx register functions that creates the React elements
    // this is done this way because React.createElement cannot be called until
    // React is loaded by requirejs
    var registeredFunctions = {};

    var items = {};
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });

    var ready;
    var loading;

    var checkDependencies = function () {

        if (ready || loading) {
            return;
        }

        loading = true;

        require(['react'], function () {

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

}
