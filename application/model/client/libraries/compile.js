function LibraryCompile(application, item) {
    "use strict";

    var events = item.events;

    var properties = item.properties;
    properties.expose(['compiling']);

    var promise;

    application.compile = function (params) {

        if (properties.compiling) {
            return promise;
        }

        properties.compiling = true;
        events.trigger('change');

        promise = new Promise(function (resolve, reject) {

            var action = new module.Action('libraries/compile', params);
            action.onResponse = function (response) {
                console.log(response);
            };
            action.onError = function (response) {

            };

            return action.execute({'promise': true});

        });

        return promise;

    };

}
