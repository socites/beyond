function Library(beyond, name) {

    Object.defineProperty(this, 'is', {'get': () => 'library'});
    Object.defineProperty(this, 'hosts', {'get': () => beyond.hosts.libraries[name]});

    Object.defineProperty(this, 'name', {'get': () => name});
    Object.defineProperty(this, 'version', {'get': () => beyond.hosts.libraries[name].version});
    Object.defineProperty(this, 'path', {'get': () => `libraries/${name}`});

}
