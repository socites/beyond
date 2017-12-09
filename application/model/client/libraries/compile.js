function LibraryCompile(library, item) {
    "use strict";

    var events = item.events;

    var properties = item.properties;
    properties.expose(['compiling']);

    var promise;

    function compile() {

        return new Promise(function (resolve, reject) {

            var params = {'library': library.id};

            var action = new module.Action('libraries/compile', params);
            action.onResponse = function (response) {
                console.log(response);
            };
            action.onError = function (response) {

            };

            return action.execute({'promise': true});

        });

    }

    library.compile = function () {

        if (properties.compiling) {
            return promise;
        }

        properties.compiling = true;
        events.trigger('change');

        function onBuildMessage(data) {
            console.log(data);
        }

        promise = new Promise(function (resolve, reject) {

            var socket;
            var message = 'build.libraries.' + library.id;
            module.socket()
                .then(function (o) {
                    socket = o;
                    socket.on(message, onBuildMessage);
                    return socket;
                })
                .then(compile)
                .then(function () {
                    socket.off(message, onBuildMessage);
                })

        });

        return promise;

    };

}
