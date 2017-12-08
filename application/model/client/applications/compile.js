function ApplicationCompile(application, item) {
    "use strict";

    var events = item.events;

    var properties = item.properties;
    properties.expose('compiling');

    var promise;

    application.compile = function () {

        if (properties.compiling) {
            return promise;
        }

        properties.compiling = true;
        events.trigger('change');

        console.log('compiling application');

        promise = new Promise(function (resolve, reject) {

        });

        return promise;

    };

}
