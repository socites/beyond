function Request(action, params) {

    let module = action.module;

    let log = localStorage.getItem('log');
    if (log) {
        params = (params) ? params : {};
        params.log = log;
    }

    Object.defineProperty(this, 'action', {'get': () => action});

    let serialized = {
        'moduleID': module.ID,
        'action': action.path,
        'params': params
    };

    Object.defineProperty(this, 'params', {'get': () => params});

    serialized.version = (module.ID.substr(0, 10) === 'libraries/') ?
        module.library.version : beyond.params.version;

    Object.defineProperty(this, 'serialized', {
        'get': function () {

            let output = {};
            $.extend(output, serialized, true);
            return output;

        }
    });

}
