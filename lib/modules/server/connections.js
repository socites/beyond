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
            Error(`Error running service on "${container.name}"`)
        }

    };

    /**
     * Start listening connections
     *
     * @param namespace (object)
     * @returns {Promise<void>}
     */
    this.listen = async function (namespace) {

        if (!service.code || typeof service.code.rpc !== 'function') {
            return;
        }

        try {
            await service.code.listen(namespace);
        }
        catch (exc) {

            console.log('\n');
            console.log('service start error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);
            return;

        }

    };

    /**
     * When a new connection is opened
     *
     * @param context
     * @returns {Promise<void>}
     */
    this.connection = async function (context) {

    };

    /**
     * When the socket disconnects
     *
     * @param context
     * @returns {Promise<void>}
     */
    this.disconnect = async function (context) {

    };

};
