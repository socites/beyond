module.exports = function (container, config, runtime) {

    let service;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return !!service;
        }
    });

    this.initialise = async function () {

        service = new (require('./service.js'))(container, config, runtime);

        try {
            await service.initialise();
        } catch (exc) {
            service = undefined;
            console.error(exc.stack);
            console.error(`Error running service on "${container.name}"`)
        }

    };

    /**
     * Start listening connections
     *
     * @param namespace (object)
     * @returns {Promise<void>}
     */
    this.listen = async function (namespace) {
        if (service.code && typeof service.code.rpc === 'function') {
            await service.code.listen(namespace);
        }
    };

    /**
     * When a new connection is opened
     *
     * @param context
     * @returns {Promise<void>}
     */
    this.connection = async function (context) {
        if (service.code && typeof service.code.connection === 'function') {
            await service.code.connection(context);
        }
    };

    /**
     * When the socket disconnects
     *
     * @param context
     * @returns {Promise<void>}
     */
    this.disconnect = async function (context) {
        if (service.code && typeof service.code.disconnect === 'function') {
            await service.code.disconnect(context);
        }
    };

};
