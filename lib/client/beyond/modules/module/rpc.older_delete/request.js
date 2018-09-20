function Request(action, params) {

    let module = action.module;

    let log = localStorage.getItem('log');
    if (log) {
        if (!params) params = {};
        params.log = log;
    }

    Object.defineProperty(this, 'action', {'get': () => action});
    Object.defineProperty(this, 'params', {'get': () => params});

    let serialized = {
        'moduleID': module.ID,
        'action': action.path,
        'params': params
    };
    serialized.version = (module.ID.startsWith('libraries/')) ? module.library.version : beyond.params.version;
    Object.defineProperty(this, 'serialized', {'get': () => $.extend({}, serialized, true)});

}
