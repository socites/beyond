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

    var pathnames = {};

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
            'type': type
        };

        if (pathname) {
            pathnames[pathname] = items[moduleID];
        }

    }

    this.getByPathname = function (pathname) {

        if (pathnames[pathname]) return pathnames[pathname];

        pathname = pathname.split('/')
        while (pathname.pop()) {

            var module = pathnames[pathname.join('/')];
            if (module) return module;

        }

    };

    this.getByModuleID = function (moduleID) {

        return items[moduleID];

    };

    this.get = function (specs) {

        if (specs.moduleID) return this.getByModuleID(specs.moduleID);
        else if (specs.pathname) return this.getByPathname(specs.pathname);

    };

    this.registerPathname = function (pathname, moduleID) {

        if (!items[moduleID]) {
            console.error('Module "' + moduleID + '" is not a registered control.');
            return;
        }

        pathnames[pathname] = items[moduleID];

    };

};
