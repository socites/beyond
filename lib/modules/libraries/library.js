module.exports = function (name, config, runtime) {

    let valid;
    Object.defineProperty(this, 'valid', {'get': () => !!valid});
    Object.defineProperty(this, 'name', {'get': () => name});
    Object.defineProperty(this, 'dirname', {'get': () => config.dirname});
    Object.defineProperty(this, 'standalone', {'get': () => config.standalone});

    let service;
    Object.defineProperty(this, 'service', {'get': () => service});

    let versions = new (require('./versions'))(this, config.versions, runtime);
    Object.defineProperty(this, 'versions', {'get': () => versions});

    let connect = config.connect;
    Object.defineProperty(this, 'connect', {'get': () => connect});

    let build = config.build;
    Object.defineProperty(this, 'build', {'get': () => build});
    Object.defineProperty(this, 'npm', {'get': () => config.npm});

    this.initialise = async function () {
        valid = true;
    };

};
