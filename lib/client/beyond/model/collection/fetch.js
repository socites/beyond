function CollectionFetch(base, specs) {
    "use strict";

    var events = base.events;
    var props = base.properties;
    props.expose(['fetching', 'fetched']);

    function fetch(params) {

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
                    var entry = module.factories[specs.factory].get(id);
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

    }

    base.expose('fetch', fetch);
    base.expose('load', function (specs) {

        specs = (specs) ? specs : {};

        var collection = this;

        fetch().then(function () {

            if (!specs.items) {
                return;
            }

            for (var index in collection.entries) {
                var entry = collection.entries[index];
                entry.load(specs.items);
            }

        });

    });

}
