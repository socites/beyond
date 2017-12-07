function ApplicationsFetch(base, specs) {
    "use strict";

    var events = base.events;
    var props = base.properties;
    props.expose(['fetching', 'fetched']);

    base.expose('load', function (params) {

        props.fetching = true;
        events.trigger('change');

        return new Promise(function (resolve, reject) {

            var action = new specs.server.module.Action(specs.server.path, params);
            action.onResponse = function (response) {

                if (!(response instanceof Array)) {

                    props.fetching = false;
                    props.error = base.ERRORS.INVALID_RESPONSE;
                    events.trigger('change');
                    resolve();

                }

                props.fetching = false;
                props.fetched = true;

                var entries = [];
                for (var index in response) {
                    var id = response[index];
                    var entry = model.factories[specs.item].get(id);
                    entries.push(entry);
                }

                props.entries = entries;
                events.trigger('change');
                resolve();

            };
            action.onError = function (response) {
                reject(response);
            };
            action.execute();

        });

    });

}
