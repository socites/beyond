var Modules = function (events) {
    "use strict";

    var loaded = {};
    this.loaded = loaded;

    var items = {};
    var keys = [];
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });
    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    // List of modules that are multilanguage
    var multilanguage = new Map();
    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return multilanguage;
        }
    });

    this.get = function (moduleID, extendedID) {

        var done = function () {

            events.trigger(moduleID + ':done');
            events.trigger('done', moduleID);

            loaded[moduleID] = true;

        };

        var extended;
        if (extendedID) {
            extended = items[extendedID];
            if (!extended) {
                extended = new Module(moduleID, events);
                items[extendedID] = extended;
                keys.push(extendedID);
            }
        }

        var module = items[moduleID];
        if (!module) {
            module = new Module(moduleID, events);
            items[moduleID] = module;
            keys.push(moduleID);
        }


        if (extended) return [module, extended];
        else return [module, done];

    };

};
