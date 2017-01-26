var Control = function (name, specs) {
    "use strict";

    var path = specs.path;
    var type = (specs.type) ? specs.type : 'control';

    Object.defineProperty(this, 'name', {
        'get': function () {
            return name;
        }
    });

    if (path.substr(0, 7) !== 'http://' || path.substr(0, 8) !== 'https://') {

        if (path.substr(0, 12) === 'application/') {

            // shift the "application" string
            path = path.split('/')
            path.shift();
            var componentPath = path.join('/');
            path = beyond.requireConfig.paths['application'] + '/' + componentPath + '/' + type + '.html';

        }
        else if (path.substr(0, 10) === 'libraries/') {

            var original = path;

            path = path.split('/');

            // shift the "libraries" string
            path.shift();
            // shift the library name
            var libraryName = path.shift();

            path = path.join('/');

            // search the library path
            var libraryPath = beyond.requireConfig.paths['libraries/' + libraryName];
            if (!libraryPath) {
                console.warn('library ' + libraryName + ' does not exist, check the module "' + original + '"');
                return;
            }

            path = libraryPath + '/' + path;

            var multilanguage = beyond.modules.multilanguage.get(original);
            if (multilanguage && multilanguage.indexOf(type) !== -1) {
                path += '/' + type + '/' + beyond.params.language + '.html';
            }
            else {
                path += '/' + type + '.html';
            }

        }
        else {

            var vendor;
            vendor = beyond.requireConfig.paths['libraries/vendor'];
            vendor = vendor + '/static/bower_components/';

            path = vendor + path;

        }

    }

    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });


    var loaded;
    Object.defineProperty(this, 'loaded', {
        'get': function () {
            return !!loaded;
        }
    });

    var loading;
    Object.defineProperty(this, 'loading', {
        'get': function () {
            return !!loading;
        }
    });

    var callbacks = [];

    this.load = function (callback) {

        if (loaded) {
            callback();
            return;
        }

        callbacks.push(callback);

        if (loading) return;

        loading = true;
        window.Polymer.Base.importHref(path, function () {

            loading = false;
            loaded = true;

            for (var i in callbacks) {
                callbacks[i]();
            }
            callbacks = [];

        });

    };

};
