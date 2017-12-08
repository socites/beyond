function Library() {
    "use strict";

    var Item = new module.model.Item({
        'server': {
            'module': module,
            'path': '/libraries'
        }
    });

    return function (id) {

        var item = new Item(this, id);
        var properties = item.properties;
        properties.expose(['name', 'dirname']);

        this.update = function (data) {
            properties.name = data.name;
            properties.dirname = data.dirname;
        };

        new LibraryCompile(this, item);

    };

}
