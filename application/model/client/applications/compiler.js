function ApplicationCompiler(application, item) {
    "use strict";

    var events = item.events;

    var properties = item.properties;
    properties.expose(['compiling']);

    var messages = [];
    Object.defineProperty(this, 'messages', {
        'get': function () {
            return messages;
        }
    });

    var compiler = this;
    Object.defineProperty(application, 'compiler', {
        'get': function () {
            return compiler;
        }
    });

    var promise;

    function onReadyToCompile() {

        return new Promise(function (resolve, reject) {

            var params = {'application': application.id};

            var action = new module.Action('applications/compile', params);
            action.onResponse = function (response) {

                properties.compiling = false;
                events.trigger('change');

            };
            action.onError = function (response) {

                properties.compiling = false;
                events.trigger('change');

            };

            return action.execute({'promise': true});

        });

    }

    function compile() {

        if (properties.compiling) {
            return promise;
        }

        messages = [];
        properties.compiling = true;
        events.trigger('change');

        function onBuildMessage(data) {
            messages.push(data);
            events.trigger('change');
        }

        promise = new Promise(function (resolve, reject) {

            var socket;
            var message = 'build.applications.' + application.id;
            module.socket()
                .then(function (o) {
                    socket = o;
                    socket.on(message, onBuildMessage);
                    return socket;
                })
                .then(onReadyToCompile)
                .then(function () {
                    socket.off(message, onBuildMessage);
                })

        });

        return promise;

    }

    application.compile = compile;
    this.compile = compile;

}
