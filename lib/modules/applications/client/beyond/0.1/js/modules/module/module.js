var Module = function (ID, events) {
    "use strict";

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
        action.onError = function (reason, error) {

            if (callback) {
                if (error) callback(error);
                else callback(reason);
            }

        };
        action.execute();

    };


    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

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

    Object.defineProperty(this, 'path', {
        'get': function () {
            // remove the 'libraries/' or the 'application/'
            var path = ID.split('/');
            path.shift();

            path = path.join('/');
            if (this.ID === this.library.path) path = path + '/main';

            return path;
        }
    });

    Object.defineProperty(this, 'custom', {
        'get': function () {
            var custom = 'application/custom/' + this.path;
            return custom;
        }
    });

    this.channel = function (callback) {

        if (this.ID.substr(0, 10) === 'libraries/') {

            if (!library.channel) {
                console.error('library does not support server communication', library.name);
                return;
            }
            library.channel(function (channel) {
                callback(channel);
            });

        }
        else {

            beyond.channel(function (channel) {
                callback(channel);
            });

        }

    };

};
