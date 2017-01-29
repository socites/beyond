var Module = function (ID, events) {
    "use strict";

    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

    var library;
    (function (ID) {

        ID = ID.split('/');
        if (ID[0] === 'libraries') {
            library = beyond.libraries.get(ID[1]);
        }

    })(ID);
    Object.defineProperty(this, 'library', {
        'get': function () {
            return library;
        }
    });

    var path = ID;
    if (library && path === library.path) {
        path = path + '/main';
    }

    path = path.split('/');
    if (library) {
        // Remove /libraries/library
        path.splice(0, 2);
    }
    else {
        // Remove /application
        path.splice(0, 1);
    }

    path = path.join('/');

    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });

    var host;
    if (library) {
        host = beyond.hosts.libraries[library.name].js;
    }
    else {
        host = beyond.hosts.application.js;
    }
    host += path;
    Object.defineProperty(this, 'host', {
        'get': function () {
            return host;
        }
    });

    var plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {
        'get': function () {
            return plugins;
        }
    });

    var texts = new Texts(this);
    Object.defineProperty(this, 'texts', {
        'get': function () {
            return texts;
        }
    });

    this.react = new ReactRegister(this, events);

    this.controls = new Controls(this);

    this.dependencies = new Dependencies(this);

    this.Action = Action(this, events);

    this.invalidateCache = function (actionPath, params) {

        var request = new Request(this, actionPath, params);
        var cache = new Cache();

        return cache.invalidate(request);

    };

    this.execute = function () {

        var args = [].slice.call(arguments);

        // options must be after callback
        var actionPath, params, callback, options;

        for (var i in args) {

            var arg = args[i];
            switch (typeof arg) {
                case 'string':
                    actionPath = arg;
                    break;
                case 'function':
                    callback = arg;
                    break;
                case 'object':
                    if (callback) options = arg;
                    else params = arg;
            }

        }

        if (typeof params === 'function' && typeof callback === 'undefined') {
            callback = params;
            params = undefined;
        }

        var action = new this.Action(actionPath, params);
        action.onResponse = function (response) {
            if (callback) callback(response);
        };
        action.onError = function (error) {
            if (callback) callback(undefined, error);
        };
        action.execute();

    };

    var styles = new ModuleStyles(this);
    Object.defineProperty(this, 'styles', {
        'get': function () {
            return styles;
        }
    });

    Object.defineProperty(this, 'css', {
        'get': function () {
            return styles;
        }
    });

    var templates = new ModuleTemplates(this);
    Object.defineProperty(this, 'templates', {
        'get': function () {
            return templates;
        }
    });

    this.render = function (path, params) {
        return templates.render(path, params);
    };

    Object.defineProperty(this, 'custom', {
        'get': function () {
            var custom = 'application/custom/' + this.path;
            return custom;
        }
    });

    this.socket = function (callback) {

        if (this.ID.substr(0, 10) === 'libraries/') {

            if (!library.socket) {
                console.error('library does not support server communication', library.name);
                return;
            }
            library.socket(function (socket) {
                callback(socket);
            });

        }
        else {

            beyond.socket(function (socket) {
                callback(socket);
            });

        }

    };

};
