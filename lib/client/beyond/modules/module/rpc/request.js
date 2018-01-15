var Request = function (action, params) {
    "use strict";

    var module = action.module;

    var log = localStorage.getItem('log');
    if (log) {
        if (!params) params = {};
        params.log = log;
    }

    Object.defineProperty(this, 'action', {
        'get': function () {
            return action;
        }
    });

    var serialized = {
        'moduleID': module.ID,
        'action': action.path,
        'params': params
    };

    Object.defineProperty(this, 'params', {
        'get': function () {
            return params;
        }
    });

    if (module.ID.substr(0, 10) === 'libraries/') {
        serialized.version = module.library.version;
    }
    else {
        serialized.version = beyond.params.version;
    }

    Object.defineProperty(this, 'serialized', {
        'get': function () {

            var output = {};
            $.extend(output, serialized, true);
            return output;

        }
    });

};
