function BatchFetch(specs) {
    "use strict";

    specs = (specs) ? specs : {};

    var promises = new Map();
    var order = [];

    var max = (specs.max) ? specs.max : 30;

    function fetch() {

        if (!order.length) {
            // No more items to fetch
            return;
        }

        var batch = order.splice(0, max);
        var ids = batch.join(',');

        var params = {
            'ids': ids,
            'limit': max
        };

        var path = specs.server.path + '/get';
        var action = new specs.server.module.Action(path, params);

        function onError() {

            for (var index in batch) {

                var id = batch[index];
                var promise = promises.get(id);
                promises.delete(id);
                promise.reject(error);

            }

        }

        action.onResponse = function (response) {

            ids = [];
            for (var index = batch.length - 1; index >= 0; index--) {

                var id = batch[index];

                var promise = promises.get(id);
                var item = promise.item;

                batch.splice(batch.indexOf(id), 1);
                promises.delete(id);
                promise.resolve(response[id]);

            }

            fetch();

        };

        action.onError = onError;

        action.execute({'policy': action.POLICY.COMMUNICATION_ERRORS});

    }

    var timer;

    this.fetch = function (item) {

        if (promises.has(item.id)) {
            return promises.get(item.id).promise;
        }

        order.push(item.id);
        var promise = new Promise(function (resolve, reject) {

            promises.set(item.id, {
                'item': item,
                'promise': promise,
                'resolve': resolve,
                'reject': reject
            });

        });

        clearTimeout(timer);
        timer = setTimeout(fetch, 0);

        return promise;

    };

}
