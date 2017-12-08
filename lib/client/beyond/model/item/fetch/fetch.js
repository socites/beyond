function ItemFetch(base, item) {
    "use strict";

    var events = base.events;
    var props = base.properties;
    props.expose(['fetching', 'fetched']);

    var promise;
    item.fetch = function () {

        if (!base.id) {
            throw new Error('Graph id must be set before calling the fetch method');
        }

        if (props.fetching) {
            return promise;
        }
        props.fetching = true;
        base.error = undefined;
        events.trigger('change');

        promise = new Promise(function (resolve, reject) {

            batch.fetch(item)
                .then(function (response) {

                    props.fetching = false;

                    // The batch fetcher will not send the response if the graph is
                    // there is not an update
                    if (!response) {
                        resolve();
                        events.trigger('change');
                        return;
                    }

                    props.fetched = true;

                    try {
                        item.update(response);
                        events.trigger('change');
                        resolve();
                    }
                    catch (exc) {
                        base.error = base.ERROR_CODE.INVALID_RESPONSE;
                        console.log(exc.stack);
                        reject(exc);
                    }

                })
                .catch(function (error) {

                    props.fetching = false;
                    base.error = base.ERROR_CODE.SERVER_ERROR;
                    events.trigger('change');
                    reject(base.error);

                });

        });

        return promise;

    };

    item.load = function () {
        item.fetch();
    };

}
