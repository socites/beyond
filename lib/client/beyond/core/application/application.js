function Application(beyond) {

    Object.defineProperty(this, 'is', {'get': () => 'application'});
    Object.defineProperty(this, 'hosts', {'get': () => beyond.hosts.application});
    Object.defineProperty(this, 'params', {'get': () => beyond.config.params});

    let extensions = new Extensions();
    let handler = new ExtensionsHandler(extensions);

    this.extend = function (name, extension) {
        extensions.register(name, extension);
    };

    let proxy = new Proxy(this, handler);
    Object.defineProperty(this, 'proxy', {
        'get': () => proxy
    });

}
