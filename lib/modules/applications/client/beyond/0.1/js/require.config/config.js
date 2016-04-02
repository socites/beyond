var RequireConfig = function (events) {
    "use strict";

    onError(events);

    // register the paths of the imported libraries by the application
    var hosts = beyond.hosts;
    var paths = {};

    if (hosts.application && hosts.application.js) {
        if (beyond.params.local)
            paths.application = location.origin + hosts.application.js;
        else
            paths.application = hosts.application.js;
    }

    for (var name in hosts.libraries) {

        var library = hosts.libraries[name];
        if (beyond.params.local)
            paths['libraries/' + name] = location.origin + library.js;
        else
            paths['libraries/' + name] = library.js;

    }

    requirejs.config({'paths': paths});

    Object.defineProperty(this, 'paths', {
        'get': function () {
            return requirejs.s.contexts._.config.paths;
        }
    });

};
