function Application() {
    "use strict";

    var item = new module.model.Item(this, id, {
        'server': {
            'module': module,
            'path': '/applications'
        }
    });

    return function (id) {
        "use strict";

        var properties = item.properties;
        properties.expose(['name', 'dirname']);

        this.update = function (data) {
            properties.name = data.name;
            properties.dirname = data.dirname;
        };

    }

}
