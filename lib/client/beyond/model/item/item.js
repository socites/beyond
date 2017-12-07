function Item(item, id) {
    "use strict";

    var base = new ModelBase(item);
    base.properties.expose('id', 'error');

    Object.defineProperty(this, 'properties', {
        'get': function () {
            return base.properties;
        }
    });

    base.id = id;

    new ItemFetch();

}
