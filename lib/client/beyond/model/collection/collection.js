function Collection(collection, specs) {
    "use strict";

    var base = new ModelBase(collection);
    base.properties.expose('entries', 'error');

    new ApplicationsFetch(base, specs);

}
