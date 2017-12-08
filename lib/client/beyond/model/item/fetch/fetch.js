function ItemFetch(batch, base, item) {
    "use strict";

    var events = base.events;
    var properties = base.properties;
    properties.expose(['fetching', 'fetched', 'loaded']);

    var promise;
    item.fetch = function () {

        if (!base.id) {
            throw new Error('Graph id must be set before calling the fetch method');
        }

        if (properties.fetching) {
            return promise;
        }
        properties.fetching = true;
        properties.error = undefined;
        events.trigger('change');

        promise = new Promise(function (resolve, reject) {

            batch.fetch(item)
                .then(function (response) {

                    properties.fetching = false;

                    // The batch fetcher will not send the response if the graph is
                    // there is not an update
                    if (!response) {
                        resolve();
                        events.trigger('change');
                        return;
                    }

                    properties.fetched = true;
                    properties.loaded = true;

                    try {
                        item.update(response);
                        events.trigger('change');
                        resolve();
                    }
                    catch (exc) {
                        properties.error = base.ERRORS.INVALID_RESPONSE;
                        console.log(exc.stack);
                        reject(exc);
                    }

                })
                .catch(function (error) {

                    properties.fetching = false;
                    properties.error = base.ERRORS.INVALID_RESPONSE;
                    events.trigger('change');
                    reject(properties.error);

                });

        });

        return promise;

    };

    item.load = function (specs) {

        specs = (specs) ? specs : {};

        if (item.loaded && !specs.update) {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
        if (!item.loaded) {
            return item.fetch();
        }

    };

}
