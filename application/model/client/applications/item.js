function Application(id) {
    "use strict";

    var item = new module.model.Item(this, id);

    var properties = item.properties;
    properties.expose(['name', 'dirname']);

    this.update = function (data) {
        properties.name = data.name;
        properties.dirname = data.dirname;
    };

}
