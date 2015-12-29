var ModulesControls = function (config) {
    "use strict";

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

    for (var moduleID in config) {

        var control = config[moduleID];

        var type, pathname;
        if (typeof control === 'string') {
            pathname = control;
        }
        else if (typeof control === 'object') {
            type = control.type;
            pathname = control.pathname;
        }
        else if (typeof control === 'boolean') {
            type = 'screen';
        }
        else continue;

        if (type !== 'surface') type = 'screen';

        keys.push(moduleID);

        items[moduleID] = {
            'moduleID': moduleID,
            'pathname': pathname,
            'type': type
        };

    }

    this.getByPathname = function (pathname) {

        for (var moduleID in items) {
            if (items[moduleID].pathname === pathname)
                return items[moduleID];
        }

    };

    this.getByModuleID = function (moduleID) {

        return items[moduleID];

    };

    this.get = function (specs) {

        if (specs.moduleID) return this.getByModuleID(specs.moduleID);
        else if (specs.pathname) return this.getByPathname(specs.pathname);

    };

    this.register = function (moduleID, type, pathname) {

        if (type !== 'surface') type = 'screen';

        if (items[moduleID]) return;

        items[moduleID] = {
            'moduleID': moduleID,
            'type': type,
            'pathname': pathname
        };

        keys.push(moduleID);

    };

};
