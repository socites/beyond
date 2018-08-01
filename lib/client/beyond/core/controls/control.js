function Control(name, specs) {

    let path = specs.path;
    let type = (specs.type) ? specs.type : 'control';

    Object.defineProperty(this, 'name', {'get': () => name});

    if (path.substr(0, 7) !== 'http://' || path.substr(0, 8) !== 'https://') {

        if (path.substr(0, 12) === 'application/') {

            // shift the "application" string
            path = path.split('/')
            path.shift();
            let componentPath = path.join('/');
            path = beyond.requireConfig.paths['application'] + '/' + componentPath + '/' + type + '.html';

        }
        else if (path.substr(0, 10) === 'libraries/') {

            let original = path;

            path = path.split('/');

            // shift the "libraries" string
            path.shift();
            // shift the library name
            let libraryName = path.shift();

            path = path.join('/');

            // search the library path
            let libraryPath = beyond.requireConfig.paths['libraries/' + libraryName];
            if (!libraryPath) {
                console.warn('library ' + libraryName + ' does not exist, check the module "' + original + '"');
                return;
            }

            path = libraryPath + '/' + path;

            let multilanguage = beyond.modules.multilanguage.get(original);
            if (multilanguage && multilanguage.indexOf(type) !== -1) {
                path += '/' + type + '/' + beyond.params.language + '.html';
            }
            else {
                path += '/' + type + '.html';
            }

        }
        else {

            let vendor;
            vendor = beyond.requireConfig.paths['libraries/vendor'];
            vendor = vendor + '/static/bower_components/';

            path = vendor + path;

        }

    }

    Object.defineProperty(this, 'path', {'get': () => path});

    let loading, loaded;
    Object.defineProperty(this, 'loaded', {'get': () => !!loaded});
    Object.defineProperty(this, 'loading', {'get': () => !!loading});

    let callbacks = [];

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

            for (let i in callbacks) {
                callbacks[i]();
            }
            callbacks = [];

        });

    };

}
