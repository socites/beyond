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

        if (dependencies.code) {
            dependencies.require = dependencies.code;
        }

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
            callbacks[i](modules);
        }
        callbacks = [];

    }

    this.done = function (callback) {

        if (ready) {
            callback(modules);
            return;
        }
        callbacks.push(callback);

    };

    var coordinate = new Coordinate(
        'controls',
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

        var type;

        // Extract the type of the resource to get the moduleID
        var moduleID = (function (resource) {

            resource = resource.split('/');
            type = resource.pop();
            return resource.join('/');

        })(resource);

        var multilanguage = beyond.modules.multilanguage.get(moduleID);
        if (multilanguage && multilanguage.indexOf(type) !== -1) {
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
        if (mods.indexOf('react') !== -1) {
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

        if (dependencies.controls instanceof Array && dependencies.controls.length) {
            beyond.controls.import(dependencies.controls, coordinate.controls);
        }
        else {
            coordinate.done('controls');
        }

    }

    if (dependencies) load();

}
