function ContainerHosts(path, config) {

    Object.defineProperty(this, 'path', {'get': () => path});

    config = (config) ? config : {};
    config = (typeof config === 'string') ? {'js': config} : config;

    if (config.js && location.protocol !== 'file:') {
        config.js = location.origin + config.js;
        config.js = config.js.replace(/\/$/, ''); // Remove trailing slash
    }

    Object.defineProperty(this, 'js', {'get': () => config.js});
    Object.defineProperty(this, 'ws', {'get': () => config.ws});

}
