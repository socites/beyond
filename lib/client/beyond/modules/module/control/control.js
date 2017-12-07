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
    this.define = function (Controller, updateState, Actions, creator) {
        "use strict";

        if (!id) {
            throw new Error('Control id was not specified, check the module.json file');
        }
        if (typeof Controller !== 'function') {
            throw new Error('Controller not set or invalid');
        }
        if (typeof updateState !== 'function') {
            throw new Error('updateState function not set or invalid');
        }
        if (typeof Actions !== 'function') {
            throw new Error('Actions not set or invalid');
        }
        if (creator && typeof creator !== 'function') {
            throw new Error('Invalid creator function');
        }

        var specs = {
            'Controller': Controller,
            'updateState': updateState,
            'Actions': Actions,
            'creator': creator
        };

        var properties = this.properties;

        // Convert type from String to Object
        for (var name in properties) {
            var property = properties[name];
            if (typeof property === 'string') {
                properties[name] = {'specs': property};
                property = properties[name];
            }

            switch (property.type) {
                case 'String':
                    property.type = String;
                    break;
                case 'Boolean':
                    property.type = Boolean;
                    break;
                case 'Number':
                    property.type = Number;
                    break;
                case 'Date':
                    property.type = Date;
                    break;
                case 'Array':
                    property.type = Array;
                    break;
                default:
                    property.type = Object;
            }
        }

        specs.properties = properties;
        specs.methods = this.methods;

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
