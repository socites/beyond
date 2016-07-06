function Dependencies(module) {
    "use strict";

    var dependencies;
    Object.defineProperty(module, 'dependencies', {
        'get': function () {
            return this;
        },
        'set': function (value) {
            if (dependencies) {
                console.error('Module dependencies can only be set once')
                return;
            }
            dependencies = value;
            load();
        }
    });

    var ready;
    var callbacks = [];

    function done() {

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    }

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }
        callbacks.push(callback);

    };

    var coordinate = new Coordinate(
        'polymer',
        'require',
        'react',
        done);

    var requireDependencies = [];
    for (var dependency in dependencies.require) {
        requireDependencies.push(dependency);
    }

    function load() {

        // Wait for react to be ready if react is on the dependencies list
        if (requireDependencies.indexOf('react') !== -1) {
            module.react.done(coordinate.react);
        }
        else {
            coordinate.done('react');
        }

        if (requireDependencies.length) {

            require(requireDependencies, function () {

                var args = [].slice.call(arguments);
                module.dependencies = {};

                for (var i in requireDependencies) {
                    dependency = requireDependencies[i];
                    var varName = dependencies.require[dependency];
                    module.dependencies[varName] = args[i];
                }

                coordinate.done('require');

            });

        }
        else {
            coordinate.done('require');
        }

        if (dependencies.polymer) {
            beyond.polymer.import(dependencies.polymer, coordinate.polymer);
        }
        else {
            coordinate.done('polymer');
        }

    }

}
