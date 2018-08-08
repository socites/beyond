beyond.module.extend('socket', async function (module) {

    if (module.container.is === 'library') {

    }

    if (module.id.substr(0, 10) === 'libraries/') {

        if (!library.socket) {
            throw new Error(`library "${library.name}" does not support server communication`);
        }
        return await library.socket;

    }
    else {
        return await beyond.socket;
    }

});

beyond.modules.extend('Action', function (module) {

    let ModuleAction = Action(this, events);
    Object.defineProperty(this, 'Action', {'get': () => ModuleAction});

    this.invalidateCache = function (actionPath, params) {
        let request = new Request(this, actionPath, params);
        let cache = new Cache();

        return cache.invalidate(request);
    };

    this.execute = function () {

        let args = [].slice.call(arguments);

        // options must be after callback
        let actionPath, params, callback, options;

        for (let i in args) {

            let arg = args[i];
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

        let action = new ModuleAction(actionPath, params);
        action.onResponse = function (response) {
            if (callback) callback(response);
        };
        action.onError = function (error) {
            if (callback) callback(undefined, error);
        };
        action.execute();

    };

});
