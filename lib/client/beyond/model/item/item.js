function Item(item, id) {
    "use strict";

    var base = new ModelBase(item);
    base.properties.expose('id', 'error');

    base.id = id;

    new ItemFetch();

}
