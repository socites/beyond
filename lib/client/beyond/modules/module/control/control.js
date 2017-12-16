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
    Object.defineProperty(this, 'defined', {
        'get': function () {
            return defined;
        }
    });

    this.define = function () {
        "use strict";

        var properties, methods, Controller, updateState, Actions, creator, react;
        if (arguments.length === 1) {

            var params = arguments[0];
            if (typeof params !== 'object') {
                throw new Error('Invalid parameters');
            }

            Controller = params.Controller;
            updateState = params.updateState;
            Actions = params.Actions;
            creator = params.creator;
            react = params.react;
            properties = (params.properties) ? params.properties : this.properties;
            methods = (params.methods) ? params.methods : this.methods;

        }
        else {

            Controller = arguments[0];
            updateState = arguments[1];
            Actions = arguments[2];
            creator = arguments[3];
            properties = this.properties;
            methods = this.methods;

        }

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
            'creator': creator,
            'react': react
        };

        for (var name in properties) {

            var property = properties[name];
            if (typeof property === 'string') {
                properties[name] = {'type': property};
                property = properties[name];
            }

            var type = property.type;
            if (typeof type === 'string') {

                type = type.toLowerCase();
                switch (type) {
                    case 'string':
                        property.type = String;
                        break;
                    case 'boolean':
                        property.type = Boolean;
                        break;
                    case 'number':
                        property.type = Number;
                        break;
                    case 'date':
                        property.type = Date;
                        break;
                    case 'array':
                        property.type = Array;
                        break;
                    default:
                        property.type = Object;
                }

            }

        }

        specs.properties = properties;
        specs.methods = methods;

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
