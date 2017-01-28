var Library = function (beyond, name) {
    "use strict";

    Object.defineProperty(this, 'name', {
        'get': function () {
            return name;
        }
    });

    Object.defineProperty(this, 'version', {
        'get': function () {
            return beyond.hosts.libraries[name].version;
        }
    });

    Object.defineProperty(this, 'path', {
        'get': function () {
            return 'libraries/' + name;
        }
    });

    var host = beyond.hosts.libraries[name].ws;
    if (host) {
        exportSocket(this, beyond, host);
    }

};
