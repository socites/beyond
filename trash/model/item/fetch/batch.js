function ItemBatchFetch(specs) {
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

        var params = {
            'ids': batch,
            'limit': max
        };

        var path = specs.server.path + '/items';
        var action = new specs.server.module.Action(path, params);

        function onError(error) {

            for (var index in batch) {

                var id = batch[index];
                var promise = promises.get(id);
                promises.delete(id);
                promise.reject(error);

            }

        }

        action.onResponse = function (response) {

            for (var index = batch.length - 1; index >= 0; index--) {

                var id = batch[index];

                var promise = promises.get(id);
                var base = promise.base;

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

    this.fetch = function (base) {

        if (!base.id) {
            console.log('item:', base);
            throw new Error('item does not have its id');
        }

        if (promises.has(base.id)) {
            return promises.get(base.id).promise;
        }

        order.push(base.id);
        var promise = new Promise(function (resolve, reject) {

            promises.set(base.id, {
                'base': base,
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
