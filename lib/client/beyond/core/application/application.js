function Application(beyond) {

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
