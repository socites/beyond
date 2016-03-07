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

        keys.push(pathname);

        items[pathname] = {
            'moduleID': moduleID,
            'pathname': pathname,
            'type': type
        };

    }

    this.getByPathname = function (pathname) {

        return items[pathname];

    };

    this.getByModuleID = function (moduleID) {

        for (var pathname in items) {
            if (items[pathname].moduleID === moduleID)
                return items[pathname];
        }

    };

    this.get = function (specs) {

        if (specs.moduleID) return this.getByModuleID(specs.moduleID);
        else if (specs.pathname) return this.getByPathname(specs.pathname);

    };

    this.register = function (moduleID, type, pathname) {

        if (type !== 'surface') type = 'screen';

        items[pathname] = {
            'moduleID': moduleID,
            'type': type,
            'pathname': pathname
        };

        if (!items[pathname]) {
            keys.push(moduleID);
        }

    };

};
