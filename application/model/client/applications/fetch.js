function ApplicationsFetcher(base) {
    "use strict";

    var events = base.events;
    var props = base.properties;
    props.expose(['fetching', 'fetched']);

    base.expose('load', function (params) {

        props.fetching = true;
        events.trigger('change');

        return new Promise(function (resolve, reject) {

            var action = new module.Action('/applications', params);
            action.onResponse = function (response) {

            };
            action.onError = function (response) {

            };
            action.execute();

        });

    });

}
