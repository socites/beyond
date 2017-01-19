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

    function getResourcePath(resource) {

        if (resource.substr(0, 12) === 'application/') {
            return 'application/' + resource.substr(12);
        }

        if (resource.substr(0, 10) !== 'libraries/') {
            return resource;
        }

        // Extract the type of the resource to get the moduleID
        var moduleID = (function (resource) {

            resource = resource.split('/');
            resource.pop();
            return resource.join('/');

        })(resource);

        var multilanguage = beyond.modules.multilanguage.get(moduleID);
        if (multilanguage && multilanguage.indexOf('code') !== -1) {
            return resource + '/' + beyond.params.language;
        }
        else {
            return resource;
        }

    }

    function load() {

        var mods = [];

        var dependency;
        for (var resource in dependencies.require) {
            mods.push(getResourcePath(resource));
        }

        // Wait for react to be ready if react is on the dependencies list
        if (mods.react) {
            module.react.done(coordinate.react);
        }
        else {
            coordinate.done('react');
        }

        if (mods.length) {

            require(mods, function () {

                var args = [].slice.call(arguments);

                var i = 0;
                for (dependency in dependencies.require) {

                    var name = dependencies.require[dependency];
                    modules[name] = args[i];
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
