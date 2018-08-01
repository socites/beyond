function Hosts(config) {

    config = (config) ? config : {};
    config.libraries = (config.libraries) ? config.libraries : {};

    let application = new ContainerHosts('application', config.application);
    Object.defineProperty(this, 'application', {'get': () => application});

    let libraries = new Map();
    Object.defineProperty(this, 'libraries', {'get': () => libraries});

    for (let name in config.libraries) {

        if (!config.libraries.hasOwnProperty(name)) continue;
        libraries.set(name, new ContainerHosts(`libraries/${name}`, config.libraries[name]));

    }

}
