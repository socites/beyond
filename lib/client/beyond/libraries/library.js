function Library(beyond, name) {
    'use strict';

    Object.defineProperty(this, 'name', {
        'get': () => name
    });
    Object.defineProperty(this, 'version', {
        'get': () => beyond.hosts.libraries[name].version
    });
    Object.defineProperty(this, 'path', {
        'get': () => `libraries/${name}`
    });

    let host = beyond.hosts.libraries[name].ws;
    (host) ? exportSocket(this, beyond, host) : null;

}
