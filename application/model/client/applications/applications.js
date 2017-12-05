function Applications(model) {
    "use strict";

    var base = new model.ModelBase(this);
    base.properties.expose('entries');

    new ApplicationsFetch(base);

}
