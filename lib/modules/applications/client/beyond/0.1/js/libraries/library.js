var Library = function (beyond, name, channels) {
    "use strict";

    var events = new Events({'bind': this});

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
    if (host) Channel(channels, this, host, events);

};
