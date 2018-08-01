function ControlPath(name, module, bundle) {

    let path = module;
    Object.defineProperty(this, 'value', {'get': () => path});

    type = (type) ? type : 'control';

    if (path.substr(0, 12) === 'application/') {

        // Shift the "application" string
        path = path.substr(12);
        path.shift();
        path = path.join('/');

        let host = beyond.hosts.application.js;
        if (!host) {
            console.error(`Application host is not defined. Control "${name}" cannot be loaded`);
            path = undefined;
        } else {
            path = `${host}/${path}/${type}.html`
        }

    }
    else if (path.substr(0, 10) === 'libraries/') {

        path = path.split('/');
        path.shift(); // Shift the "libraries" string
        let library = path.shift(); // Shift the library name

        path = path.join('/');

        // Get the library path
        let hosts = beyond.hosts.libraries;

        if (!hosts.has(library) || !hosts.get(library).js) {
            console.error(`Library "${library}" does not have a host specified or is not registered. Control "${name}" cannot be loaded`);
            return;
        }

        path = `${hosts.get(library).js}/${path}`;

        let multilanguage = beyond.modules.multilanguage.get(module);
        if (multilanguage && multilanguage.indexOf(bundle) !== -1) {
            path += `/${bundle}/${beyond.params.language}.html`;
        }
        else {
            path += `/${bundle}.html`;
        }

    }

}
