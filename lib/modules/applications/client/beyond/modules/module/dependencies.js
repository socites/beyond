function Dependencies(module, dependencies) {
    "use strict";

    var modules = {};
    Object.defineProperty(this, 'modules', {
        'get': function () {
            return modules;
        }
    });

    this.set = function (value) {

        if (dependencies) {
            console.error('Module dependencies can only be set once')
            return;
        }
        dependencies = value;
        load();

    };

    var ready;
    Object.defineProperty(this, 'loaded', {
        'get': function () {
            return !!ready;
        }
    });

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

    function getMultilanguageDependency(dependency) {

        if (dependency.substr(0, 10) !== 'libraries/') {
            return dependency;
        }

        var multilanguage = beyond.modules.multilanguage.get(dependency);
        if (multilanguage && multilanguage.indexOf('code') !== -1) {
            return dependency + '/code/' + beyond.params.language;
        }
        else {
            return dependency + '/code';
        }

    }

    function load() {

        var mods = {
            'original': dependencies.require,
            'multilanguage': {},
            'list': []
        };

        var dependency;
        for (dependency in mods.original) {
            mods.list.push(dependency);
        }

        // Wait for react to be ready if react is on the dependencies list
        if (mods.list.indexOf('react') !== -1) {
            module.react.done(coordinate.react);
        }
        else {
            coordinate.done('react');
        }

        if (mods.list.length) {

            for (var i in mods.list) {

                dependency = mods.list[i];
                mods.list[i] = getMultilanguageDependency(dependency);

            }

            require(mods.list, function () {

                var args = [].slice.call(arguments);

                var i = 0;
                for (dependency in mods.original) {

                    var varName = mods.original[dependency];
                    modules[varName] = args[i];
                    i++;

                }

                coordinate.done('require');

            });

        }
        else {
            coordinate.done('require');
        }

        if (dependencies.polymer instanceof Array && dependencies.polymer.length) {
            beyond.polymer.import(dependencies.polymer, coordinate.polymer);
        }
        else {
            coordinate.done('polymer');
        }

    }

    if (dependencies) load();

}
