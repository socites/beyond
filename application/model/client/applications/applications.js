function Applications(model) {
    "use strict";

    var base = new model.ModelBase(this);

    new ApplicationsFetch(base);

    var entries;
    Object.defineProperty(this, 'entries', {
        'get': function () {
            return entries;
        }
    });

}
