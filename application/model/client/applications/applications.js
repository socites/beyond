function Applications() {
    "use strict";

    var base = new ModelBase(this);

    new ApplicationsFetcher(base);

    var entries;
    Object.defineProperty(this, 'entries', {
        'get': function () {
            return entries;
        }
    });

}
