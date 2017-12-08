function Item(specs) {
    "use strict";

    var batch = new ItemBatchFetch(specs);

    return function (item, id) {
        "use strict";

        var base = new ModelBase(item);
        base.properties.expose('id', 'error');

        Object.defineProperty(this, 'properties', {
            'get': function () {
                return base.properties;
            }
        });

        base.id = id;

        new ItemFetch(batch, base, item);

    };

}
