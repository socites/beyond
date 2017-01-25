function Controls(module) {
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
    this.define = function (type, specs) {
        "use strict";

        if (['Control', 'PullDown'].indexOf(type) === -1) {
            throw new Error('Control type "' + type + '" is invalid');
        }
        if (typeof specs !== 'object') {
            throw new Error('Invalid parameters');
        }

        if (defined) {
            throw new Error('Control already defined');
        }
        defined = true;

        beyond.ui[type](id, module.dependencies, specs.create, specs.behaviors);

    };

}
