function Item(specs) {
    "use strict";

    var batch = new ItemBatchFetch(specs);

    return function (object, id) {
        "use strict";

        var base = new ModelBase(object);
        base.properties.expose('id', 'error');

        Object.defineProperty(this, 'events', {
            'get': function () {
                return base.events;
            }
        });

        Object.defineProperty(this, 'properties', {
            'get': function () {
                return base.properties;
            }
        });

        base.properties.id = id;

        new ItemFetch(batch, base, object);

    };

}
