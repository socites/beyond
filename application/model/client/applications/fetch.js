function ApplicationsFetch(base) {
    "use strict";

    var events = base.events;
    var props = base.properties;
    props.expose(['fetching', 'fetched']);

    base.expose('load', function (params) {

        props.fetching = true;
        events.trigger('change');

        return new Promise(function (resolve, reject) {

            var action = new module.Action('applications', params);
            action.onResponse = function (response) {

                props.fetching = false;
                props.fetched = true;
                props.entries = response;
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
