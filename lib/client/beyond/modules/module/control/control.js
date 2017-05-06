function Control(module) {
    "use strict";

    var id;
    Object.defineProperty(this, 'id', {
        'get': function () {
            return id;
        },
        'set': function (value) {
            if (id) {
                throw new Error('Attribute "id" is read only');
            }
            id = value;
        }
    });

    var defined;
    this.define = function (specs) {
        "use strict";

        if (!id) {
            throw new Error('Control id was not specified, check the module.json file');
        }
        if (typeof specs !== 'object') {
            throw new Error('Invalid parameters');
        }

        if (defined) {
            throw new Error('Control already defined');
        }
        defined = true;

        var behavior = new Behavior(module, specs);
        Polymer({'is': id, 'behaviors': [behavior]});

    };

}
