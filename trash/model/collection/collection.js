function Collection(collection, specs) {
    "use strict";

    if (typeof specs !== 'object' || typeof specs.factory !== 'string' || !specs.server) {
        console.log('collection specs:', specs);
        throw new Error('Invalid collection specification');
    }

    var base = new ModelBase(collection);
    base.properties.expose(['entries', 'error']);

    new CollectionFetch(base, specs);

}
