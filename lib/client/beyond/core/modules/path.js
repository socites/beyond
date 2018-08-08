function ModulePath(module) {

    let id = module.id;

    let split = id.split('/');
    let container = (split[0] === 'libraries') ? 'library' : 'application';

    let library = (container === 'library') ? split[1] : undefined;
    Object.defineProperty(this, 'library', {'get': () => library});

    let path = id;
    path += (container === 'library' && split.length === 2) ? '/main' : '';
    Object.defineProperty(this, 'value', {'get': () => path});

    // Remove the container path: /application or /libraries/[name]
    let internal = split.slice(((container === 'application')) ? 1 : 2).join('/');
    Object.defineProperty(this, 'path', {'get': () => internal});

    let hosts = (container === 'application') ?
        beyond.hosts.application :
        beyond.hosts.libraries.get(path.library);

    let host = (hosts && hosts.js) ? hosts.js : undefined;
    Object.defineProperty(this, 'host', {'get': () => host});

    let src = (host) ? `${host}/${path}` : undefined;
    Object.defineProperty(this, 'src', {
        'get': function () {
            return (module.multilanguage) ? `${src}/${beyond.params.language}` : src;
        }
    });

}
