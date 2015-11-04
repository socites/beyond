var Loader = function (events) {
    "use strict";

    onError(events);

    var ready = false;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    // register the paths of the imported libraries by the application
    var hosts = beyond.hosts;
    var paths = {
        'application': location.origin + hosts.application.js
    };
    for (var name in hosts.libraries) {

        var library = hosts.libraries[name];
        paths['libraries/' + name] = location.origin + library.js;

    }
    requirejs.config({'paths': paths});

    Object.defineProperty(this, 'paths', {
        'get': function () {
            return requirejs.s.contexts._.config.paths;
        }
    });

    // load the libraries in steps, in order to respect their dependencies
    var base = 'libraries/beyond.js/static/vendor/';
    var steps = [
        {
            "libraries": [
                base + 'jquery-2.1.4',
                base + 'socket.io',
                base + 'hogan-3.0.2'
            ],
            "progress": '50%'
        },
        {
            "libraries": [
                base + 'jquery.mousewheel',
                'application/start'
            ],
            "progress": "100%"
        }
    ];

    var load = function (step) {

        if (step === steps.length) {
            ready = true;
            events.trigger('ready');
        }
        else {

            events.trigger('progress', steps[step].progress);

            // load the libraries defined in the next step
            require(steps[step].libraries, function () {
                step++;
                load(step);
            });

        }
    };
    load(0);

};
