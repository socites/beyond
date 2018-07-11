module.exports = function () {

    let service;

    this.initialise = function () {

        return new Promise(async function (resolve) {

            service = new (require('./service.js'))(this, config.service, runtime);
            await service.initialise();

            resolve();

        });

    };

    this.rpc = global.async(async function (resolve, reject, ions) {

        if (!service.code || typeof service.code.rpc !== 'function') {
            return;
        }

        try {
            await service.code.rpc(ions);
        }
        catch (exc) {

            console.log('\n');
            console.log('service start error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);
            return;

        }

        resolve();

    });

    this.connect = global.async(async function (resolve, reject, context) {

        if (!service.code || typeof service.code.connection !== 'function') {
            resolve();
            return;
        }

        try {
            await service.code.connection(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service connection error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);

        }

        resolve();

    });

    this.disconnect = global.async(async function (resolve, reject, context) {

        if (!service.code || typeof service.code.disconnect !== 'function') {
            return;
        }

        try {
            await service.code.disconnect(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service disconnect error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);
            return;

        }

        resolve();

    });

};
